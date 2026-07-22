require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const DATA_DIR = path.join(__dirname, 'data');

async function runSetup() {
  console.log('=== SYRIA FOUR Supabase Setup ===\n');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL not found in .env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  // Create/update schema
  console.log('Creating/updating database schema...');
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase-schema.sql'), 'utf8');
    await pool.query(schemaSql);
    try { await pool.query("NOTIFY pgrst, 'reload schema'"); } catch(e) { }
    console.log('Schema ready.\n');
  } catch (err) {
    console.error('Schema failed:', err.message);
    process.exit(1);
  }

  // Migrate all data
  // Create chat storage bucket
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'chat-uploads')) {
        await supabase.storage.createBucket('chat-uploads', { public: true, fileSizeLimit: 52428800 });
        console.log('Created chat-uploads storage bucket.');
      } else {
        console.log('chat-uploads bucket already exists.');
      }
    }
  } catch (e) {
    console.log('Storage bucket setup:', e.message);
  }

  const collections = [
    'members', 'tournaments', 'events', 'leaderboard',
    'orders', 'support', 'instagram', 'gallery', 'videos',
    'notifications', 'players', 'users', 'sessions', 'audit_logs', 'requests',
    'awards', 'vip', 'hall-of-fame',
    'conversations', 'conversation_members', 'messages', 'message_reads',
    'typing_status', 'user_presence', 'blocked_users',
    'pinned_messages', 'deleted_messages'
  ];

  let totalMigrated = 0;
  for (const col of collections) {
    const filePath = path.join(DATA_DIR, `${col}.json`);
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data || data.length === 0) continue;

    console.log(`Migrating ${col}: ${data.length} records...`);
    for (const item of data) {
      if (Object.keys(item).length === 0) continue;
      const record = { ...item };
      if (!record.created_at) record.created_at = new Date().toISOString();
      const keys = Object.keys(record);
      const values = keys.map(k => {
        const v = record[k];
        return typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
      });
      const placeholders = keys.map((_, i) => `$${i + 1}`);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const updates = keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ');
      const sql = `INSERT INTO "${col}" (${cols}) VALUES (${placeholders}) ON CONFLICT ("id") DO UPDATE SET ${updates}`;
      try {
        await pool.query(sql, values);
        totalMigrated++;
      } catch (err) {
        console.error(`  Error inserting into ${col}:`, err.message);
      }
    }
  }

  console.log(`\nMigration complete: ${totalMigrated} records migrated.`);
  await pool.end();
  console.log('Done!');
}

runSetup().catch(console.error);

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const DATA_DIR = path.join(__dirname, 'data');

async function runSetup() {
  console.log('=== SYRIA FOUR Supabase Setup ===\n');

  // 1. Check credentials
  const dbUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL not found in .env');
    console.log('Please add DATABASE_URL=postgresql://... to your .env file');
    console.log('You can find it in Supabase Studio > Project Settings > Database > Connection string');
    process.exit(1);
  }

  // 2. Create schema
  console.log('Creating database schema...');
  const pool = new Pool({ connectionString: dbUrl });
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'supabase-schema.sql'), 'utf8');
    await pool.query(schemaSql);
    // Reload PostgREST schema cache so it picks up new columns
    try { await pool.query("NOTIFY pgrst, 'reload schema'"); } catch(e) { /* not critical */ }
    console.log('Schema created successfully.\n');
  } catch (err) {
    console.error('Schema creation failed:', err.message);
    process.exit(1);
  }

  // 3. Migrate data using pg directly (bypass PostgREST cache)
  const collections = [
    'members', 'tournaments', 'events', 'leaderboard',
    'orders', 'support', 'instagram', 'gallery', 'videos',
    'notifications', 'players', 'users', 'sessions', 'audit_logs', 'requests'
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
      // Convert camelCase keys to match SQL column names, add created_at if missing
      const record = { ...item };
      if (!record.created_at) record.created_at = new Date().toISOString();
      const keys = Object.keys(record);
      const values = keys.map(k => {
        const v = record[k];
        return typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
      });
      const placeholders = keys.map((_, i) => `$${i + 1}`);
      const cols = keys.map(k => `"${k}"`).join(', ');
      // Build upsert: INSERT ... ON CONFLICT (id) DO UPDATE
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

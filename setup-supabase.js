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
    console.log('Schema created successfully.\n');
  } catch (err) {
    console.error('Schema creation failed:', err.message);
    process.exit(1);
  }

  // 3. Migrate data
  const supabase = createClient(supabaseUrl, supabaseKey);
  const collections = [
    'members', 'tournaments', 'events', 'leaderboard',
    'orders', 'support', 'instagram', 'gallery', 'videos',
    'notifications', 'players'
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
      const { error } = await supabase.from(col).upsert(item, { onConflict: 'id' });
      if (error) console.error(`  Error inserting into ${col}:`, error.message);
      else totalMigrated++;
    }
  }

  console.log(`\nMigration complete: ${totalMigrated} records migrated.`);
  await pool.end();
  console.log('Done!');
}

runSetup().catch(console.error);

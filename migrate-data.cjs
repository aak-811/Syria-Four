require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jqomaoohlzhcxgimvjot.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxb21hb29obHpoY3hnaW12am90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk3ODA2NiwiZXhwIjoyMDk5NTU0MDY2fQ.WtiyFpCAX89j37xCYfhYvL_MABQaBbtLtEZyC0yQJro';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_DIR = path.join(__dirname, 'data');

const ALL_COLLECTIONS = [
  'members', 'tournaments', 'events', 'leaderboard',
  'orders', 'support', 'instagram', 'gallery', 'videos',
  'notifications', 'players',
  'users', 'sessions', 'audit_logs', 'requests'
];

async function migrateCollection(col) {
  const filePath = path.join(DATA_DIR, `${col}.json`);
  if (!fs.existsSync(filePath)) return 0;
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return 0;
  let data;
  try { data = JSON.parse(raw); } catch(e) { return 0; }
  if (!Array.isArray(data) || data.length === 0) return 0;

  let success = 0, errors = 0;
  for (const item of data) {
    if (Object.keys(item).length === 0) continue;
    // Strip any undefined values
    const clean = {};
    for (const [k, v] of Object.entries(item)) {
      if (v !== undefined) clean[k] = v;
    }
    const { error } = await supabase.from(col).upsert(clean, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ ${col}: ${error.message?.substring(0,120)}`);
      errors++;
    } else {
      success++;
    }
  }
  if (errors > 0) console.log(`  ${col}: ${success} OK, ${errors} FAILED`);
  else if (success > 0) console.log(`  ✅ ${col}: ${success} records`);
  return success;
}

async function main() {
  console.log('=== SYRIA FOUR Data Migration ===\n');

  // Test connection
  const { error: testErr } = await supabase.from('members').select('id', { count: 'exact', head: true });
  if (testErr) {
    console.error('Supabase connection failed:', testErr.message);
    console.log('Check your SUPABASE_URL and SUPABASE_KEY in .env');
    process.exit(1);
  }

  console.log('Connected to Supabase. Starting migration...\n');

  let total = 0;
  for (const col of ALL_COLLECTIONS) {
    const count = await migrateCollection(col);
    total += count;
  }

  console.log(`\n✅ Migration complete: ${total} total records migrated.`);

  // Verify
  console.log('\n--- Verification ---');
  for (const col of ALL_COLLECTIONS) {
    const { count, error } = await supabase.from(col).select('*', { count: 'exact', head: true });
    if (error) console.log(`  ❌ ${col}: ${error.message}`);
    else console.log(`  ${col}: ${count} records`);
  }
}

main().catch(console.error);

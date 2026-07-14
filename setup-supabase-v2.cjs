const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jqomaoohlzhcxgimvjot.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxb21hb29obHpoY3hnaW12am90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk3ODA2NiwiZXhwIjoyMDk5NTU0MDY2fQ.WtiyFpCAX89j37xCYfhYvL_MABQaBbtLtEZyC0yQJro';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Use service key for DDL if available
const ANON_KEY = SUPABASE_KEY;
const SERVICE_KEY = SUPABASE_SERVICE_KEY || SUPABASE_KEY;

function apiCall(method, path, body, useServiceKey = false) {
  return new Promise((resolve, reject) => {
    const key = useServiceKey ? SERVICE_KEY : ANON_KEY;
    const options = {
      hostname: SUPABASE_URL.replace('https://', ''),
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'return=minimal'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: data.substring(0,500) }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('=== Supabase Migration v2 ===');

  // Try to use the pg_dump endpoint or SQL execution
  // Supabase doesn't expose DDL via REST directly.
  // Alternative: Use the supabase-js client for CRUD
  // For DDL, we can try the management API
  
  // First check what tables exist via REST
  try {
    const r = await apiCall('GET', '/rest/v1/members?limit=1&select=count');
    console.log('Members table exists:', r.status);
  } catch(e) {
    console.log('Members check error:', e.message);
  }

  // Check if new tables exist
  const tables = ['users', 'sessions', 'audit_logs', 'requests'];
  for (const t of tables) {
    try {
      const r = await apiCall('GET', `/rest/v1/${t}?limit=1`);
      if (r.status === 200) {
        console.log(`✅ Table '${t}' exists (status ${r.status})`);
      } else if (r.status === 404 || r.status === 400) {
        console.log(`❌ Table '${t}' missing (status ${r.status})`);
      } else {
        console.log(`❓ Table '${t}' unexpected status ${r.status}: ${r.data}`);
      }
    } catch(e) {
      console.log(`❌ Table '${t}' error:`, e.message);
    }
  }

  console.log('\nPlease run the SQL in supabase-schema.sql manually in Supabase Studio SQL Editor.');
  console.log('Then run: node setup-supabase-v2.cjs migrate-data');
}

async function migrateData() {
  console.log('=== Migrating JSON data to Supabase ===');
  
  const collections = ['members', 'tournaments', 'users', 'sessions', 'audit_logs', 'requests'];
  for (const col of collections) {
    const filePath = path.join(__dirname, 'data', `${col}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${col}.json not found, skipping`);
      continue;
    }
    const raw = fs.readFileSync(filePath, 'utf8').trim();
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data) || data.length === 0) {
      console.log(`ℹ️  ${col}: empty, skipping`);
      continue;
    }
    
    // Supabase REST insert with upsert
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    let success = 0, errors = 0;
    for (const item of data) {
      const { data: result, error } = await supabase.from(col).upsert(item, { onConflict: '_id' }).select();
      if (error) {
        console.log(`❌ ${col} insert error:`, error.message.substring(0,100));
        errors++;
      } else {
        success++;
      }
    }
    console.log(`✅ ${col}: ${success}/${data.length} records migrated${errors ? `, ${errors} errors` : ''}`);
  }
}

const arg = process.argv[2];
if (arg === 'migrate-data') {
  migrateData().catch(console.error);
} else {
  run().catch(console.error);
}

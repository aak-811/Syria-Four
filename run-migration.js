require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sql = fs.readFileSync(path.join(__dirname, 'migrate-notifications.sql'), 'utf8');
  const statements = sql.split(';').filter(s => s.trim());
  let ok = 0;
  for (const stmt of statements) {
    try {
      await pool.query(stmt);
      ok++;
    } catch (e) {
      console.error('Failed:', e.message);
    }
  }
  console.log(`Migration: ${ok}/${statements.length} statements applied.`);
  await pool.end();
}
run().catch(console.error);

require('dotenv').config({path:'.env'});
const {Pool} = require('pg');
const p = new Pool({connectionString: process.env.DATABASE_URL});
(async()=>{
const tables=['members','tournaments','events','leaderboard','orders','support','instagram','gallery','notifications','players','requests','users','sessions','audit_logs'];
for(const t of tables){
 try {
  const r=await p.query('SELECT * FROM "'+t+'" LIMIT 2');
  console.log('=== '+t+' ('+r.rows.length+' rows) ===');
  if(r.rows.length>0){console.log('Keys: '+Object.keys(r.rows[0]).join(', ')); console.log(JSON.stringify(r.rows[0],null,2))}
  console.log('');
 }catch(e){console.log(t+': ERROR - '+e.message)}
}
await p.end();
})().catch(console.error);

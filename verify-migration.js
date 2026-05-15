require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Read JSON file
function readJsonFile(filename) {
  const filePath = path.join(__dirname, 'public', 'data', filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

async function verifyTable(tableName, jsonFile) {
  console.log(`\n=== ${tableName.toUpperCase()} ===`);
  
  // Count records in database
  const dbResult = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
  const dbCount = parseInt(dbResult.rows[0].count);
  
  // Count records in JSON file
  const jsonData = readJsonFile(jsonFile);
  const jsonCount = jsonData.data.length;
  
  console.log(`Database records: ${dbCount}`);
  console.log(`JSON file records: ${jsonCount}`);
  
  if (dbCount === jsonCount) {
    console.log(`✓ All ${jsonCount} records migrated successfully`);
    
    // Show sample data
    const sampleResult = await pool.query(`SELECT * FROM ${tableName} LIMIT 1`);
    if (sampleResult.rows.length > 0) {
      console.log(`Sample record:`, JSON.stringify(sampleResult.rows[0], null, 2));
    }
  } else {
    console.log(`✗ Mismatch! Expected ${jsonCount}, found ${dbCount}`);
  }
}

async function verifyAll() {
  try {
    console.log('Verifying database migration...\n');
    
    await verifyTable('anggota', 'anggota.json');
    await verifyTable('artikel', 'artikel.json');
    await verifyTable('berita', 'berita.json');
    await verifyTable('kegiatan', 'kegiatan.json');
    await verifyTable('notulensi', 'notulensi.json');
    
    console.log('\n=== VERIFICATION COMPLETE ===');
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyAll();

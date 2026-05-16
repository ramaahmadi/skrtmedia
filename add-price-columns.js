require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addPriceColumns() {
  try {
    console.log('Adding ticket_price_min and ticket_price_max columns to kegiatan table...');
    
    // Add ticket_price_min column
    await pool.query(`
      ALTER TABLE kegiatan 
      ADD COLUMN IF NOT EXISTS ticket_price_min INTEGER
    `);
    console.log('✓ ticket_price_min column added');

    // Add ticket_price_max column
    await pool.query(`
      ALTER TABLE kegiatan 
      ADD COLUMN IF NOT EXISTS ticket_price_max INTEGER
    `);
    console.log('✓ ticket_price_max column added');

    await pool.end();
    console.log('\n✓ Price columns added successfully');
  } catch (error) {
    console.error('✗ Error adding price columns:', error);
    process.exit(1);
  }
}

addPriceColumns();

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addPembukuanTable() {
  try {
    console.log('Adding pembukuan table to database...');
    
    // Create the pembukuan table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pembukuan (
        id UUID PRIMARY KEY,
        date DATE,
        type VARCHAR(20) NOT NULL,
        category VARCHAR(255),
        amount NUMERIC NOT NULL,
        description TEXT,
        created_by VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE,
        updated_at TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('✓ pembukuan table created');

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pembukuan_date ON pembukuan(date)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pembukuan_type ON pembukuan(type)');
    console.log('✓ Indexes created');

    await pool.end();
    console.log('\n✓ pembukuan table added successfully');
  } catch (error) {
    console.error('✗ Error adding pembukuan table:', error);
    process.exit(1);
  }
}

addPembukuanTable();

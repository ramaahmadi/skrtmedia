require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database connection
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

// Migrate anggota (members)
async function migrateAnggota() {
  console.log('Migrating anggota...');
  const data = readJsonFile('anggota.json');

  for (const item of data.data) {
    const query = `
      INSERT INTO anggota (id, name, phone, position, email, join_date, is_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `;
    await pool.query(query, [
      item.id,
      item.name,
      item.phone,
      item.position,
      item.email,
      item.join_date,
      item.is_admin,
      item.created_at,
      item.updated_at
    ]);
  }
  console.log(`✓ Migrated ${data.data.length} anggota records`);
}

// Migrate artikel (articles)
async function migrateArtikel() {
  console.log('Migrating artikel...');
  const data = readJsonFile('artikel.json');

  for (const item of data.data) {
    const query = `
      INSERT INTO artikel (id, title, paragraph, images, author, role, publish_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `;
    await pool.query(query, [
      item.id,
      item.title,
      item.paragraph,
      JSON.stringify(item.images || []),
      item.author,
      item.role,
      item.publish_date,
      item.created_at,
      item.updated_at
    ]);
  }
  console.log(`✓ Migrated ${data.data.length} artikel records`);
}

// Migrate berita (news)
async function migrateBerita() {
  console.log('Migrating berita...');
  const data = readJsonFile('berita.json');

  for (const item of data.data) {
    const query = `
      INSERT INTO berita (id, title, content, category, date, author, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `;
    await pool.query(query, [
      item.id,
      item.title,
      item.content,
      item.category,
      item.date,
      item.author,
      item.role,
      item.created_at,
      item.updated_at
    ]);
  }
  console.log(`✓ Migrated ${data.data.length} berita records`);
}

// Migrate kegiatan (activities)
async function migrateKegiatan() {
  console.log('Migrating kegiatan...');
  const data = readJsonFile('kegiatan.json');

  for (const item of data.data) {
    const query = `
      INSERT INTO kegiatan (
        id, title, description, date, time, locations, status, featured, 
        hero_title, hero_subtitle, hero_quote, about_section, registration_link, 
        ticket_price, max_participants, contact_person, contact_phone, sponsors, media_partners
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (id) DO NOTHING
    `;
    await pool.query(query, [
      item.id,
      item.title,
      item.description,
      item.date,
      item.time,
      JSON.stringify(item.locations || []),
      item.status,
      item.featured,
      item.hero_title,
      item.hero_subtitle,
      item.hero_quote,
      JSON.stringify(item.about_section || {}),
      item.registration_link,
      item.ticket_price,
      item.max_participants,
      item.contact_person,
      item.contact_phone,
      JSON.stringify(item.sponsors || []),
      JSON.stringify(item.media_partners || [])
    ]);
  }
  console.log(`✓ Migrated ${data.data.length} kegiatan records`);
}

// Migrate notulensi (meeting minutes)
async function migrateNotulensi() {
  console.log('Migrating notulensi...');
  const data = readJsonFile('notulensi.json');

  for (const item of data.data) {
    const query = `
      INSERT INTO notulensi (id, date, title, content, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO NOTHING
    `;
    await pool.query(query, [
      item.id,
      item.date,
      item.title,
      item.content,
      item.created_by,
      item.created_at,
      item.updated_at
    ]);
  }
  console.log(`✓ Migrated ${data.data.length} notulensi records`);
}

// Create tables
async function createTables() {
  console.log('Creating tables...');

  const schema = `
    DROP TABLE IF EXISTS notulensi CASCADE;
    DROP TABLE IF EXISTS kegiatan CASCADE;
    DROP TABLE IF EXISTS berita CASCADE;
    DROP TABLE IF EXISTS artikel CASCADE;
    DROP TABLE IF EXISTS anggota CASCADE;

    CREATE TABLE anggota (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone BIGINT,
      position VARCHAR(255),
      email VARCHAR(255),
      join_date VARCHAR(50),
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE
    );

    CREATE TABLE artikel (
      id UUID PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      paragraph TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      author VARCHAR(255),
      role VARCHAR(100),
      publish_date VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE
    );

    CREATE TABLE berita (
      id UUID PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      content TEXT,
      category VARCHAR(100),
      date VARCHAR(50),
      author VARCHAR(255),
      role VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE
    );

    CREATE TABLE kegiatan (
      id UUID PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      date DATE,
      time VARCHAR(10),
      locations JSONB DEFAULT '[]'::jsonb,
      status VARCHAR(50),
      featured BOOLEAN DEFAULT FALSE,
      hero_title VARCHAR(500),
      hero_subtitle TEXT,
      hero_quote TEXT,
      about_section JSONB,
      registration_link TEXT,
      ticket_price INTEGER DEFAULT 0,
      max_participants INTEGER DEFAULT 0,
      contact_person VARCHAR(255),
      contact_phone BIGINT,
      sponsors JSONB DEFAULT '[]'::jsonb,
      media_partners JSONB DEFAULT '[]'::jsonb
    );

    CREATE TABLE notulensi (
      id UUID PRIMARY KEY,
      date DATE,
      title VARCHAR(500) NOT NULL,
      content TEXT,
      created_by VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE,
      updated_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX idx_anggota_name ON anggota(name);
    CREATE INDEX idx_artikel_title ON artikel(title);
    CREATE INDEX idx_berita_category ON berita(category);
    CREATE INDEX idx_kegiatan_date ON kegiatan(date);
    CREATE INDEX idx_kegiatan_status ON kegiatan(status);
    CREATE INDEX idx_notulensi_date ON notulensi(date);
  `;

  await pool.query(schema);
  console.log('✓ Tables created successfully\n');
}

// Main migration function
async function migrate() {
  try {
    console.log('Starting migration to Neon database...\n');

    await createTables();
    await migrateAnggota();
    await migrateArtikel();
    await migrateBerita();
    await migrateKegiatan();
    await migrateNotulensi();

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
migrate();

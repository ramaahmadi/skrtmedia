require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to parse CSV data
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      
      // Handle boolean conversion
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      // Handle empty arrays
      else if (value === '[]') value = [];
      // Handle empty strings
      else if (value === '') value = null;
      
      row[header] = value;
    });
    
    data.push(row);
  }
  
  return data;
}

// Import functions for each table
async function importAnggota() {
  console.log('Importing anggota data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_anggota_rows.csv');
  
  for (const row of data) {
    const { error } = await supabase
      .from('skrt_anggota')
      .upsert({
        id: row.id,
        name: row.name,
        phone: row.phone,
        position: row.position,
        email: row.email,
        join_date: row.join_date,
        is_admin: row.is_admin,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    
    if (error) {
      console.error('Error importing anggota row:', error);
    } else {
      console.log(`✓ Imported anggota: ${row.name}`);
    }
  }
}

async function importArtikel() {
  console.log('Importing artikel data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_artikel_rows.csv');
  
  for (const row of data) {
    const { error } = await supabase
      .from('skrt_artikel')
      .upsert({
        id: row.id,
        title: row.title,
        paragraph: row.paragraph,
        images: row.images,
        author: row.author,
        role: row.role,
        publish_date: row.publish_date,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    
    if (error) {
      console.error('Error importing artikel row:', error);
    } else {
      console.log(`✓ Imported artikel: ${row.title}`);
    }
  }
}

async function importBerita() {
  console.log('Importing berita data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_berita_rows.csv');
  
  for (const row of data) {
    const { error } = await supabase
      .from('skrt_berita')
      .upsert({
        id: row.id,
        title: row.title,
        content: row.content,
        category: row.category,
        date: row.date,
        author: row.author,
        role: row.role,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    
    if (error) {
      console.error('Error importing berita row:', error);
    } else {
      console.log(`✓ Imported berita: ${row.title}`);
    }
  }
}

async function importKegiatan() {
  console.log('Importing kegiatan data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_kegiatan_rows.csv');
  
  for (const row of data) {
    const { error } = await supabase
      .from('skrt_kegiatan')
      .upsert({
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        date: row.date,
        time: row.time,
        location: row.location,
        status: row.status,
        hero_title: row.hero_title,
        hero_subtitle: row.hero_subtitle,
        hero_quote: row.hero_quote,
        about_background: row.about_background,
        about_goals: row.about_goals,
        registration_link: row.registration_link,
        ticket_price: row.ticket_price ? parseFloat(row.ticket_price) : 0,
        max_participants: row.max_participants ? parseInt(row.max_participants) : 0,
        contact_person: row.contact_person,
        contact_phone: row.contact_phone,
        sponsors: row.sponsors,
        media_partners: row.media_partners,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    
    if (error) {
      console.error('Error importing kegiatan row:', error);
    } else {
      console.log(`✓ Imported kegiatan: ${row.title}`);
    }
  }
}

async function importNotulensi() {
  console.log('Importing notulensi data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_notulensi_rows.csv');
  
  for (const row of data) {
    const { error } = await supabase
      .from('skrt_notulensi')
      .upsert({
        id: row.id,
        date: row.date,
        title: row.title,
        content: row.content,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
    
    if (error) {
      console.error('Error importing notulensi row:', error);
    } else {
      console.log(`✓ Imported notulensi: ${row.title}`);
    }
  }
}

// Main import function
async function importAllData() {
  console.log('Starting CSV data import...\n');
  
  try {
    await importAnggota();
    await importArtikel();
    await importBerita();
    await importKegiatan();
    await importNotulensi();
    
    console.log('\n✅ All data imported successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importAllData();

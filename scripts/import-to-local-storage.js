const fs = require('fs');
const path = require('path');

// Function to parse CSV data
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }
  
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  let currentRow = [];
  let inQuotes = false;
  let currentField = '';
  
  // Process all lines starting from line 1 (skip headers)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // If we're not in quotes, this is the end of a row
    if (!inQuotes) {
      currentRow.push(currentField.trim());
      
      // Create row object
      const row = {};
      headers.forEach((header, index) => {
        let value = currentRow[index] || '';
        
        // Clean up quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Handle boolean conversion
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        // Handle empty arrays
        else if (value === '[]') value = [];
        // Handle empty strings
        else if (value === '') value = null;
        // Handle numeric conversion
        else if (!isNaN(value) && value !== '') {
          if (value.includes('.')) {
            value = parseFloat(value);
          } else {
            value = parseInt(value);
          }
        }
        
        row[header] = value;
      });
      
      data.push(row);
      currentRow = [];
      currentField = '';
    } else {
      // Still in quotes, add newline and continue
      currentField += '\n';
    }
  }
  
  return data;
}

// Function to save data to JSON file
function saveToJSON(data, fileName) {
  const dataDir = path.join(__dirname, '..', 'public', 'data');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, `${fileName}.json`);
  const storageData = {
    data: data,
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(filePath, JSON.stringify(storageData, null, 2));
  console.log(`✅ Saved ${data.length} records to ${filePath}`);
}

// Import functions for each data type
function importAnggota() {
  console.log('Importing anggota data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_anggota_rows.csv');
  
  // Transform data to match the expected format
  const transformedData = data.map(item => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    position: item.position,
    email: item.email,
    join_date: item.join_date,
    is_admin: item.is_admin,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
  
  saveToJSON(transformedData, 'anggota');
  return transformedData;
}

function importArtikel() {
  console.log('Importing artikel data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_artikel_rows.csv');
  
  // Transform data to match the expected format
  const transformedData = data.map(item => ({
    id: item.id,
    title: item.title,
    paragraph: item.paragraph,
    images: item.images,
    author: item.author,
    role: item.role,
    publish_date: item.publish_date,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
  
  saveToJSON(transformedData, 'artikel');
  return transformedData;
}

function importBerita() {
  console.log('Importing berita data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_berita_rows.csv');
  
  // Transform data to match the expected format
  const transformedData = data.map(item => ({
    id: item.id,
    title: item.title,
    content: item.content,
    category: item.category,
    date: item.date,
    author: item.author,
    role: item.role,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
  
  saveToJSON(transformedData, 'berita');
  return transformedData;
}

function importKegiatan() {
  console.log('Importing kegiatan data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_kegiatan_rows.csv');
  
  // Transform data to match the expected format for the Activity interface
  const transformedData = data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.date,
    time: item.time,
    locations: item.location ? [item.location] : [''],
    status: item.status || 'upcoming',
    featured: false,
    hero_title: item.hero_title,
    hero_subtitle: item.hero_subtitle,
    hero_quote: item.hero_quote,
    about_section: {
      background: item.about_background,
      goals: item.about_goals ? item.about_goals.split(',').map(g => g.trim()) : []
    },
    registration_link: item.registration_link,
    ticket_price: item.ticket_price || 0,
    max_participants: item.max_participants || 0,
    contact_person: item.contact_person,
    contact_phone: item.contact_phone,
    sponsors: item.sponsors || [],
    media_partners: item.media_partners || []
  }));
  
  saveToJSON(transformedData, 'kegiatan');
  return transformedData;
}

function importNotulensi() {
  console.log('Importing notulensi data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_notulensi_rows.csv');
  
  // Transform data to match the expected format
  const transformedData = data.map(item => ({
    id: item.id,
    date: item.date,
    title: item.title,
    content: item.content,
    created_by: item.created_by,
    created_at: item.created_at,
    updated_at: item.updated_at
  }));
  
  saveToJSON(transformedData, 'notulensi');
  return transformedData;
}

// Main import function
function importAllData() {
  console.log('Starting CSV data import to local storage...\n');
  
  try {
    const anggota = importAnggota();
    const artikel = importArtikel();
    const berita = importBerita();
    const kegiatan = importKegiatan();
    const notulensi = importNotulensi();
    
    console.log('\n🎉 All data imported successfully to local storage!');
    console.log(`📊 Summary:`);
    console.log(`   - Anggota: ${anggota.length} records`);
    console.log(`   - Artikel: ${artikel.length} records`);
    console.log(`   - Berita: ${berita.length} records`);
    console.log(`   - Kegiatan: ${kegiatan.length} records`);
    console.log(`   - Notulensi: ${notulensi.length} records`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importAllData();

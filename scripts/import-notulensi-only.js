require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

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
      
      // Handle empty strings
      if (value === '') value = null;
      
      row[header] = value;
    });
    
    data.push(row);
  }
  
  return data;
}

// Import notulensi data with retry logic
async function importNotulensi() {
  console.log('Importing notulensi data...');
  const data = parseCSV('/Users/ramaahmadi/Downloads/skrt_notulensi_rows.csv');
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    let retries = 3;
    
    while (retries > 0) {
      try {
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
          throw error;
        }
        
        console.log(`✓ Imported notulensi: ${row.title}`);
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error(`❌ Failed to import notulensi row ${i + 1}:`, error.message);
        } else {
          console.log(`⚠️ Retry ${3 - retries} for notulensi row ${i + 1}...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }
}

// Run the import
importNotulensi().then(() => {
  console.log('\n✅ Notulensi import completed!');
}).catch(error => {
  console.error('❌ Import failed:', error);
});

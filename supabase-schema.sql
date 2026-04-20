-- Create tables for SKRT Army data management
-- Run this in Supabase SQL Editor

-- Table for Berita (Event News)
CREATE TABLE IF NOT EXISTS skrt_berita (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'kegiatan',
  date TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Anggota (Members)
CREATE TABLE IF NOT EXISTS skrt_anggota (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT,
  email TEXT,
  join_date TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Kegiatan (Activities)
CREATE TABLE IF NOT EXISTS skrt_kegiatan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  status TEXT DEFAULT 'upcoming',
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_quote TEXT,
  about_background TEXT,
  about_goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Artikel (Articles)
CREATE TABLE IF NOT EXISTS skrt_artikel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  paragraph TEXT NOT NULL,
  images TEXT[],
  author TEXT NOT NULL,
  role TEXT NOT NULL,
  publish_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Pembukuan (Financial Records)
CREATE TABLE IF NOT EXISTS skrt_pembukuan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Notulensi (Meeting Notes)
CREATE TABLE IF NOT EXISTS skrt_notulensi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skrt_berita_date ON skrt_berita(date);
CREATE INDEX IF NOT EXISTS idx_skrt_anggota_name ON skrt_anggota(name);
CREATE INDEX IF NOT EXISTS idx_skrt_kegiatan_date ON skrt_kegiatan(date);
CREATE INDEX IF NOT EXISTS idx_skrt_artikel_date ON skrt_artikel(publish_date);
CREATE INDEX IF NOT EXISTS idx_skrt_pembukuan_date ON skrt_pembukuan(date);
CREATE INDEX IF NOT EXISTS idx_skrt_notulensi_date ON skrt_notulensi(date);

-- Enable Row Level Security (RLS)
ALTER TABLE skrt_berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE skrt_anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE skrt_kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE skrt_artikel ENABLE ROW LEVEL SECURITY;
ALTER TABLE skrt_pembukuan ENABLE ROW LEVEL SECURITY;
ALTER TABLE skrt_notulensi ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can restrict this later)
CREATE POLICY "Allow public read access on skrt_berita" ON skrt_berita FOR SELECT USING (true);
CREATE POLICY "Allow public insert on skrt_berita" ON skrt_berita FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on skrt_berita" ON skrt_berita FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on skrt_berita" ON skrt_berita FOR DELETE USING (true);

CREATE POLICY "Allow public read access on skrt_anggota" ON skrt_anggota FOR SELECT USING (true);
CREATE POLICY "Allow public insert on skrt_anggota" ON skrt_anggota FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on skrt_anggota" ON skrt_anggota FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on skrt_anggota" ON skrt_anggota FOR DELETE USING (true);

CREATE POLICY "Allow public read access on skrt_kegiatan" ON skrt_kegiatan FOR SELECT USING (true);
CREATE POLICY "Allow public insert on skrt_kegiatan" ON skrt_kegiatan FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on skrt_kegiatan" ON skrt_kegiatan FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on skrt_kegiatan" ON skrt_kegiatan FOR DELETE USING (true);

CREATE POLICY "Allow public read access on skrt_artikel" ON skrt_artikel FOR SELECT USING (true);
CREATE POLICY "Allow public insert on skrt_artikel" ON skrt_artikel FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on skrt_artikel" ON skrt_artikel FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on skrt_artikel" ON skrt_artikel FOR DELETE USING (true);

CREATE POLICY "Allow public read access on skrt_pembukuan" ON skrt_pembukuan FOR SELECT USING (true);
CREATE POLICY "Allow public insert on skrt_pembukuan" ON skrt_pembukuan FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on skrt_pembukuan" ON skrt_pembukuan FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on skrt_pembukuan" ON skrt_pembukuan FOR DELETE USING (true);

CREATE POLICY "Allow public read access on skrt_notulensi" ON skrt_notulensi FOR SELECT USING (true);
CREATE POLICY "Allow public insert on skrt_notulensi" ON skrt_notulensi FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on skrt_notulensi" ON skrt_notulensi FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on skrt_notulensi" ON skrt_notulensi FOR DELETE USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_skrt_berita_updated_at BEFORE UPDATE ON skrt_berita
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skrt_anggota_updated_at BEFORE UPDATE ON skrt_anggota
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skrt_kegiatan_updated_at BEFORE UPDATE ON skrt_kegiatan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skrt_artikel_updated_at BEFORE UPDATE ON skrt_artikel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skrt_pembukuan_updated_at BEFORE UPDATE ON skrt_pembukuan
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skrt_notulensi_updated_at BEFORE UPDATE ON skrt_notulensi
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

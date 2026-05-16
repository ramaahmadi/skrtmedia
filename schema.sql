-- Drop existing tables if they exist
DROP TABLE IF EXISTS pembukuan CASCADE;
DROP TABLE IF EXISTS notulensi CASCADE;
DROP TABLE IF EXISTS kegiatan CASCADE;
DROP TABLE IF EXISTS berita CASCADE;
DROP TABLE IF EXISTS artikel CASCADE;
DROP TABLE IF EXISTS anggota CASCADE;

-- Create anggota (members) table
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

-- Create artikel (articles) table
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

-- Create berita (news) table
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

-- Create kegiatan (activities) table
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
  ticket_price_min INTEGER,
  ticket_price_max INTEGER,
  max_participants INTEGER DEFAULT 0,
  contact_person VARCHAR(255),
  contact_phone BIGINT,
  sponsors JSONB DEFAULT '[]'::jsonb,
  media_partners JSONB DEFAULT '[]'::jsonb
);

-- Create notulensi (meeting minutes) table
CREATE TABLE notulensi (
  id UUID PRIMARY KEY,
  date DATE,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create pembukuan (financial records) table
CREATE TABLE pembukuan (
  id UUID PRIMARY KEY,
  date DATE,
  type VARCHAR(20) NOT NULL,
  category VARCHAR(255),
  amount NUMERIC NOT NULL,
  description TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_anggota_name ON anggota(name);
CREATE INDEX idx_artikel_title ON artikel(title);
CREATE INDEX idx_berita_category ON berita(category);
CREATE INDEX idx_kegiatan_date ON kegiatan(date);
CREATE INDEX idx_kegiatan_status ON kegiatan(status);
CREATE INDEX idx_notulensi_date ON notulensi(date);
CREATE INDEX idx_pembukuan_date ON pembukuan(date);
CREATE INDEX idx_pembukuan_type ON pembukuan(type);

-- Migration script to add slug field and generate slugs for existing records
-- Run this in Supabase SQL Editor

-- Add slug column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'skrt_kegiatan' AND column_name = 'slug'
    ) THEN
        ALTER TABLE skrt_kegiatan ADD COLUMN slug TEXT;
    END IF;
END $$;

-- Add other missing columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'skrt_kegiatan' AND column_name = 'registration_link'
    ) THEN
        ALTER TABLE skrt_kegiatan ADD COLUMN registration_link TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'skrt_kegiatan' AND column_name = 'ticket_price'
    ) THEN
        ALTER TABLE skrt_kegiatan ADD COLUMN ticket_price NUMERIC DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'skrt_kegiatan' AND column_name = 'max_participants'
    ) THEN
        ALTER TABLE skrt_kegiatan ADD COLUMN max_participants INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'skrt_kegiatan' AND column_name = 'contact_person'
    ) THEN
        ALTER TABLE skrt_kegiatan ADD COLUMN contact_person TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'skrt_kegiatan' AND column_name = 'contact_phone'
    ) THEN
        ALTER TABLE skrt_kegiatan ADD COLUMN contact_phone TEXT;
    END IF;
END $$;

-- Generate slugs for existing records
UPDATE skrt_kegiatan
SET slug = LOWER(
    REGEXP_REPLACE(
        REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
    )
)
WHERE slug IS NULL OR slug = '';

-- Add unique constraint on slug
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'skrt_kegiatan_slug_key'
    ) THEN
        ALTER TABLE skrt_kegiatan ADD CONSTRAINT skrt_kegiatan_slug_key UNIQUE (slug);
    END IF;
END $$;

-- Create index for slug if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_skrt_kegiatan_slug ON skrt_kegiatan(slug);

-- Verify the migration
SELECT id, slug, title FROM skrt_kegiatan LIMIT 5;

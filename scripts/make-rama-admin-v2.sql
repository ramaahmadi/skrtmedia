-- Set Rama (082122451622) as admin
-- Run this in Supabase SQL Editor

UPDATE skrt_anggota
SET is_admin = true
WHERE name ILIKE 'rama' AND phone = '082122451622';

-- Verify the update
SELECT id, name, phone, is_admin FROM skrt_anggota WHERE name ILIKE 'rama' AND phone = '082122451622';

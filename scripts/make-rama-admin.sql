-- Update any member with name containing "rama" (case-insensitive) to be admin
UPDATE skrt_anggota 
SET is_admin = true 
WHERE LOWER(name) LIKE '%rama%';

-- Verify the update
SELECT * FROM skrt_anggota WHERE LOWER(name) LIKE '%rama%';

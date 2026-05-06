-- Create Supabase Storage bucket for sponsor logos
-- Run this in Supabase SQL Editor

-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('sponsors', 'sponsors', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the sponsors bucket
ALTER TABLE storage.objects 
ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read on sponsors"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sponsors');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated upload on sponsors"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sponsors');

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update on sponsors"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'sponsors');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete on sponsors"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sponsors');

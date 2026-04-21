-- Create notifications table
CREATE TABLE IF NOT EXISTS skrt_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anggota_id UUID REFERENCES skrt_anggota(id) ON DELETE CASCADE,
  notulensi_id UUID REFERENCES skrt_notulensi(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'notulensi',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE skrt_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access on skrt_notifications" ON skrt_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on skrt_notifications" ON skrt_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on skrt_notifications" ON skrt_notifications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on skrt_notifications" ON skrt_notifications FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skrt_notifications_anggota_id ON skrt_notifications(anggota_id);
CREATE INDEX IF NOT EXISTS idx_skrt_notifications_notulensi_id ON skrt_notifications(notulensi_id);
CREATE INDEX IF NOT EXISTS idx_skrt_notifications_is_read ON skrt_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_skrt_notifications_created_at ON skrt_notifications(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_skrt_notifications_updated_at BEFORE UPDATE ON skrt_notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

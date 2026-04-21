-- Seed data for SKRT Army database
-- Run this after creating tables with supabase-schema.sql

-- Insert initial admin member (RAMA)
INSERT INTO skrt_anggota (name, phone, position, email, join_date, is_admin)
VALUES (
  'RAMA',
  '082122451622',
  'Admin',
  '082122451622@skrtmedia.com',
  TO_CHAR(NOW(), 'DD/MM/YYYY'),
  true
);

-- Insert Trust Islam activity
INSERT INTO skrt_kegiatan (
  title,
  description,
  date,
  time,
  location,
  status,
  hero_title,
  hero_subtitle,
  hero_quote,
  about_background,
  about_goals
)
VALUES (
  'Trust Islam - Temukan Kembali Arahmu',
  'Di tengah arus informasi yang tak terbendung, mudah sekali kita merasa bingung dan kehilangan pegangan. Kami hadir untuk menciptakan sebuah ruang jeda—sebuah jembatan untuk terhubung kembali dengan nilai-nilai yang memberi ketenangan dan tujuan hidup.',
  '2025-06-15',
  '16:00',
  'Jakarta Convention Center',
  'upcoming',
  'TRUST ISLAM',
  'Saat logika dan perasaan seolah tak sejalan, ke mana kita harus menaruh percaya?',
  'Bukan dunia yang salah, mungkin kita yang lupa arah.',
  'Di era digital yang penuh distraksi, banyak dari kita yang merasa semakin tahu banyak, semakin bingung. Muncul krisis kepercayaan, bukan hanya pada orang lain, tapi juga pada nilai-nilai yang seharusnya kita pegang.',
  'Menemukan Solusi Praktis, Memperkuat Pegangan Hidup, Menjawab Keraguan, Membangun Silaturahmi'
);

-- Sample berita data
INSERT INTO skrt_berita (title, content, category, date, author, role)
VALUES (
  'Pertemuan Rutin SKRT Army',
  'Pertemuan rutin akan diadakan setiap hari Minggu pukul 19:00 WIB. Harap semua anggota hadir untuk membahas program kerja bulan depan.',
  'kegiatan',
  TO_CHAR(NOW(), 'DD/MM/YYYY'),
  'Admin',
  'admin'
);

-- Sample artikel data
INSERT INTO skrt_artikel (title, paragraph, images, author, role, publish_date)
VALUES (
  'Pentingnya Konsistensi dalam Organisasi',
  'Konsistensi adalah kunci kesuksesan dalam setiap organisasi. Tanpa konsistensi, tujuan yang telah ditetapkan akan sulit dicapai. Dalam SKRT Army, kita berkomitmen untuk konsisten dalam setiap program dan kegiatan yang dijalankan.',
  ARRAY[]::TEXT[],
  'Admin',
  'admin',
  TO_CHAR(NOW(), 'DD/MM/YYYY')
);

-- Sample pembukuan data
INSERT INTO skrt_pembukuan (date, type, category, amount, description, created_by)
VALUES (
  TO_CHAR(NOW(), 'DD/MM/YYYY'),
  'income',
  'Iuran Anggota',
  500000,
  'Iuran bulanan dari anggota',
  'RAMA'
);

-- Sample notulensi data
INSERT INTO skrt_notulensi (date, title, content, created_by)
VALUES (
  TO_CHAR(NOW(), 'DD/MM/YYYY'),
  'Rapat Koordinasi Awal Tahun',
  '1. Evaluasi program tahun lalu
2. Perencanaan program tahun ini
3. Pembagian tugas anggota
4. Jadwal pertemuan rutin bulanan',
  'RAMA'
);

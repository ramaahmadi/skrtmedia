# SKRT Media

Website resmi dan portal informasi **SKRT (Satuan Komunitas Rayon Tiga)** untuk publikasi kegiatan, artikel & berita komunitas, pendaftaran acara, serta dashboard internal pengurus (**SKRT Army**).

## Fitur Utama

- **Beranda & Sorotan Kegiatan Dinamis** — Menampilkan kegiatan yang sedang berlangsung maupun akan datang secara real-time, dan otomatis menyembunyikan acara yang telah melewati batas waktu pada halaman utama.
- **Direktori & Detail Kegiatan (`/kegiatan`)** — Pencarian langsung, filter status (*Berlangsung*, *Akan Datang*, *Selesai*), informasi tiket, tombol simpan ke Google Calendar, serta tombol bagikan ke WhatsApp & salin tautan.
- **Artikel & Berita (`/blog`)** — Daftar tulisan dan dokumentasi komunitas lengkap dengan pencarian, estimasi waktu baca, gambar sampul, tombol bagikan, dan rekomendasi artikel terkait.
- **Pendaftaran Online & Program Khusus** — Formulir pendaftaran Qurban (`/qurban_registration`), halaman kajian (`/kajian-trust-islam`, `/trust-islam`), serta halaman kontak terintegrasi WhatsApp (`/contact`).
- **Dashboard Internal SKRT Army (`/skrt-army`)** — Dilindungi autentikasi sesi server-side (HMAC-SHA256 HttpOnly cookie) untuk mengelola:
  - Kegiatan (`/skrt-army/kegiatan`)
  - Artikel (`/skrt-army/artikel`) & Berita (`/skrt-army/berita`)
  - Data Anggota (`/skrt-army/anggota`)
  - Notulensi Rapat (`/skrt-army/notulensi`)
  - Pembukuan & Ekspor Laporan Excel/PDF (`/skrt-army/pembukuan`)
- **Mode Gelap & Terang (Dark/Light Mode)** — Didukung secara konsisten di seluruh halaman publik, halaman program, dan dashboard admin menggunakan `next-themes`.
- **SEO, PWA & Halaman Error Kustom** — Dilengkapi `robots.ts`, `sitemap.ts`, `manifest.json`, ikon & logo SKRT, serta halaman 404 (`not-found.tsx`) dan error boundary (`error.tsx`) kustom.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) & React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS v4, `next-themes`, Framer Motion, Lucide Icons
- **Database**: PostgreSQL (`pg`)
- **Utilitas Ekspor**: `xlsx` (Excel) & `jspdf` (PDF)
- **Linting**: ESLint 9 (Flat Config)
- **Deployment**: Vercel

## Struktur Proyek

```text
src/
├── app/
│   ├── about/                  # Profil & lokasi SKRT
│   ├── api/                    # REST API (auth, kegiatan, artikel, berita, anggota, notulensi, pembukuan, upload, dll.)
│   ├── blog/                   # Daftar & detail artikel/berita
│   ├── contact/                # Halaman kontak & form WhatsApp
│   ├── kajian-trust-islam/     # Halaman program kajian
│   ├── kegiatan/               # Daftar & detail kegiatan ([slug])
│   ├── qurban_registration/    # Pendaftaran Qurban
│   ├── signin/                 # Login pengurus SKRT Army
│   ├── skrt-army/              # Dashboard admin (terproteksi autentikasi)
│   ├── trust-islam/            # Halaman Trust Islam
│   ├── error.tsx               # Halaman error kustom
│   ├── not-found.tsx           # Halaman 404 kustom
│   ├── robots.ts               # Konfigurasi robots.txt
│   └── sitemap.ts              # Generator sitemap.xml
├── components/                 # Komponen UI (Header, Footer, Hero, Blog, Common, dll.)
├── lib/                        # Koneksi PostgreSQL (db.ts), auth sesi (auth.ts), tipe & helper
└── styles/                     # Konfigurasi CSS & Tailwind v4
```

## Konfigurasi Environment

Buat file `.env.local` di root proyek dan isi variabel berikut:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=ganti-dengan-string-acak-yang-kuat
```

> **Catatan:** Jangan pernah melakukan commit file `.env` atau `.env.local` ke repository.

## Menjalankan Secara Lokal

Pastikan **Node.js 20+** dan **npm** sudah terpasang.

```bash
# 1. Install dependensi
npm install

# 2. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Perintah yang Tersedia

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan Next.js |
| `npm run build` | Membangun aplikasi untuk produksi |
| `npm run start` | Menjalankan hasil build produksi |
| `npm run lint` | Menjalankan pemeriksaan ESLint 9 |

## Deployment

Aplikasi ini dideploy menggunakan **Vercel** yang terhubung langsung ke branch `main` pada repository GitHub ini. Pastikan variabel environment (`DATABASE_URL` dan `SESSION_SECRET`) telah diatur pada pengaturan proyek Vercel.

## Lisensi

© 2025–2026 SKRT Media. All rights reserved.

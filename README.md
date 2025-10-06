## SMK School Management – Next.js 13 App Router

Aplikasi manajemen sekolah (dashboard admin/guru/siswa) berbasis Next.js 13 (App Router), MongoDB, React Query, dan Tailwind. Panduan ini membantu Anda menjalankan project secara lokal hingga siap produksi.

### 1) Prasyarat

- Node.js >= 18.17.0 (cek: `node -v`)
- npm (bundled dengan Node) (cek: `npm -v`)
- MongoDB instance (lokal atau Atlas)
- Opsional: Akun Supabase jika ingin fitur upload/storage berjalan

### 2) Clone & Instalasi

```bash
git clone <repo-url>
cd project
npm install
```

### 3) Konfigurasi Environment

Buat file `.env.local` di root project, lalu isi variabel berikut sesuai lingkungan Anda.

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=smk_database

# Base URL API (frontend akan memanggil ini)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Opsional: Supabase (untuk upload gambar/dokumen)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Catatan:

- `MONGODB_URI` wajib. Jika menggunakan MongoDB Atlas, pakai connection string Atlas.
- `MONGODB_DB_NAME` bersifat opsional (default `smk_database` bila tidak diisi; sesuai `lib/database/mongodb.ts`).
- `NEXT_PUBLIC_API_URL` default ke `http://localhost:3000` bila tidak diset (lihat `lib/api-client.ts`).
- Jika tidak memakai Supabase, fitur unggah file tidak aktif; sisakan nilai kosong atau lewati variabelnya, tetapi hindari memanggil fitur upload.

### 4) Menjalankan dalam Mode Pengembangan

Pastikan MongoDB sudah berjalan, kemudian:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

### 5) Seed Database (Data Awal)

Seeder akan memanggil endpoint `POST /api/seed` di server dev, sehingga server harus aktif saat proses seeding.

Langkah:

1. Jalankan server dev di terminal pertama:
   ```bash
   npm run dev
   ```
2. Di terminal kedua, jalankan:
   ```bash
   npm run seed
   ```

Jika berhasil, Anda akan melihat ringkasan jumlah data yang diinsert (majors, students, teachers, subjects, classes, schedules, admins).

Credensial default (dari `scripts/seed.js` dan `lib/database/seeder.ts`):

- Admin: `admin` / `admin123`
- Guru: `iik_ayu` / `password123`
- Siswa: `0091128942` / `password123`

Troubleshooting seeding:

- Pastikan `npm run dev` sudah berjalan (seeder memanggil `http://localhost:3000/api/seed`).
- Pastikan `MONGODB_URI` benar dan MongoDB dapat diakses.
- Pastikan `.env.local` sudah dibuat dan berisi variabel yang diperlukan.

### 6) Build untuk Produksi

```bash
npm run build
npm start
```

Server produksi juga memerlukan variabel environment yang sama seperti `.env.local`.

### 7) Struktur Proyek (ringkas)

- `app/` — Halaman (App Router) dan API routes (`app/api/...`).
- `components/` — UI components (atoms/molecules/organisms/ui).
- `lib/` — Klien API, hooks, context, database client (`mongodb.ts`), supabase client, tipe, utilitas.
- `scripts/seed.js` — Script CLI untuk menjalankan proses seeding via endpoint API.

### 8) Skrip npm

- `npm run dev` — Menjalankan dev server Next.js.
- `npm run build` — Build production.
- `npm run start` — Menjalankan server production.
- `npm run lint` — Menjalankan ESLint.
- `npm run typecheck` — Cek tipe TypeScript.
- `npm run seed` — Menjalankan seeding database (butuh dev server aktif).

### 9) Catatan Keamanan & Deploy

- Jangan commit `.env.local` ke repo publik.
- Pada deployment (Vercel/dll), set variabel environment yang sama di dashboard deploy.
- Jika menggunakan Supabase Storage, pastikan bucket dan policy publik telah dikonfigurasi sesuai kebutuhan aplikasi.

### 10) FAQ Singkat

- Q: Perlu mengubah nama database?  
  A: Ganti `MONGODB_DB_NAME` di `.env.local` atau biarkan default `smk_database`.
- Q: Seeding gagal karena 404/ECONNREFUSED?  
  A: Jalankan `npm run dev` dulu, lalu jalankan `npm run seed` di terminal terpisah.
- Q: Di mana konfigurasi MongoDB berada?  
  A: Lihat `lib/database/mongodb.ts`.

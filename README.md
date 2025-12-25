# SMK Madyatama - Sistem Informasi Akademik

Aplikasi manajemen sekolah (SIAKAD) berbasis Next.js 13 dengan fitur dashboard admin, guru, siswa, dan staff keuangan. Dilengkapi dengan sistem notifikasi WhatsApp otomatis untuk informasi hari libur, masuk sekolah, dan peringatan ketidakhadiran.

---

## 📋 Fitur Utama

- 🎓 **Manajemen Akademik**: Jurusan, Kelas, Mata Pelajaran, Jadwal
- 👥 **Multi-Role Dashboard**: Admin, Guru, Siswa, Staff Keuangan
- 📊 **Nilai & Absensi**: Input nilai, absensi dengan GPS & foto
- 💰 **Keuangan**: Tagihan, pembayaran, laporan
- 📅 **Kalender Akademik**: Event, hari libur, kegiatan sekolah
- 📱 **Notifikasi WhatsApp Otomatis**:
  - Informasi hari libur (H-1)
  - Reminder masuk sekolah setelah libur
  - Peringatan alfa 3 hari berturut-turut

---

## 🔧 Prasyarat

- **Node.js** >= 18.17.0 (cek: `node -v`)
- **npm** (bundled dengan Node) (cek: `npm -v`)
- **MySQL** database (lokal atau cloud)

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repo-url>
cd project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env.local` di root project:

```bash
# Database (MySQL via Prisma)
DATABASE_URL="mysql://user:password@localhost:3306/smk_database"

# Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# WhatsApp Fonnte (Opsional - untuk notifikasi)
FONNTE_ACCOUNT_TOKEN=your-account-token-here

# JWT Secret
JWT_SECRET=your-secret-key-here
```

**Catatan**:

- `DATABASE_URL` wajib diisi dengan connection string MySQL
- `FONNTE_ACCOUNT_TOKEN` diperlukan untuk fitur notifikasi WhatsApp
- `JWT_SECRET` untuk authentication (generate random string)

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (data awal)
npm run seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 📱 Konfigurasi WhatsApp Notifikasi

### 1. Tambah Device WhatsApp

1. Login sebagai **Admin**
2. Buka menu **Pengaturan** → **Pengaturan Notifikasi**
3. Klik **Add New Device**
4. Isi form:
   - **Device Name**: Nama device (contoh: SMK Madyatama)
   - **Device Number**: Nomor unik 8-15 digit (contoh: 08123456789)
5. Klik **Create Device**
6. **Scan QR Code** yang muncul dengan WhatsApp Anda:
   - Buka WhatsApp → **Linked Devices** → **Link a Device**
   - Scan QR code
7. Status akan berubah menjadi **Connected**
8. Klik **Use This** untuk mengaktifkan device

### 2. Initialize Cron Jobs (Notifikasi Otomatis)

Setelah WhatsApp terkoneksi, aktifkan cron jobs:

**Via Browser**:

```
http://localhost:3000/api/cron/init
```

**Via curl**:

```bash
curl http://localhost:3000/api/cron/init
```

**Response Sukses**:

```json
{
  "success": true,
  "message": "Cron jobs initialized successfully"
}
```

**Console Logs**:

```
[CRON] ✓ Cron jobs initialized
[CRON] ✓ Holiday notifications: Daily at 18:00
[CRON] ✓ Absence alerts: Daily at 19:00
```

### 4. Jadwal Notifikasi Otomatis

Setelah cron jobs aktif, notifikasi akan terkirim otomatis:

| Waktu     | Notifikasi           | Kondisi                                  |
| --------- | -------------------- | ---------------------------------------- |
| **18:00** | Informasi Hari Libur | Jika besok ada hari libur (bukan Minggu) |
| **18:00** | Masuk Sekolah        | Jika hari ini libur dan besok masuk      |
| **19:00** | Peringatan Alfa      | Jika siswa alfa 3 hari berturut-turut    |

---

## 🧪 Test Notifikasi WhatsApp

Sebelum mengandalkan notifikasi otomatis, test terlebih dahulu:

### Via Browser (Postman/Thunder Client)

**Endpoint**: `POST http://localhost:3000/api/notifications/test`

**Headers**:

```
Content-Type: application/json
```

**Body**:

```json
{
  "type": "holiday",
  "phoneNumber": "081234567890"
}
```

**Tipe Notifikasi**:

- `Tagihan` - Test notifikasi tagihan
- `Konfirmasi Pembayaran` - Test notifikasi konfirmasi pembayaran
- `Hari Libur` - Test notifikasi hari libur
- `Masuk Sekolah` - Test notifikasi masuk sekolah
- `Alfa` - Test peringatan ketidakhadiran

### Via curl

```bash
# Test Notifikasi Hari Libur
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "holiday",
    "phoneNumber": "masukan nomor wa yg ingin dikirim tes notifikasi"
  }'

# Test Notifikasi Masuk Sekolah
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "school_entry",
    "phoneNumber": "masukan nomor wa yg ingin dikirim tes notifikasi"
  }'

# Test Peringatan Alfa
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "absence",
    "phoneNumber": "masukan nomor wa yg ingin dikirim tes notifikasi"
  }'
```

**Response Sukses**:

```json
{
  "success": true,
  "pesan": "Notifikasi Hari Libur berhasil dikirim!",
  "data": {
    "tipe": "holiday",
    "namaNotifikasi": "Notifikasi Hari Libur",
    "nomorTujuan": "masukan nomor wa yg ingin dikirim tes notifikasi",
    "waktu": "25/12/2025, 16.00.00"
  }
}
```

WhatsApp akan diterima dalam beberapa detik!

---

## 📚 Penggunaan Aplikasi

### Input Hari Libur (untuk Notifikasi)

1. Login sebagai **Admin**
2. Buka **Kalender Akademik**
3. Klik **Add Event**
4. Isi form:
   - **Title**: Nama hari libur (contoh: Hari Kemerdekaan RI)
   - **Type**: Pilih **HOLIDAY**
   - **Start Date**: Tanggal libur
   - **End Date**: Tanggal libur
   - **Published**: ✅ Centang
5. Klik **Save**

Notifikasi akan otomatis terkirim H-1 jam 18:00!

### Input Data Guru & Siswa

Pastikan nomor WhatsApp terisi agar notifikasi terkirim:

1. Buka menu **Guru** atau **Siswa**
2. Edit data
3. Isi field **Phone** dengan nomor WhatsApp (format: 081234567890)
4. Save

---

## 📦 Struktur Project

```
project/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── cron/         # Cron initialization
│   │   └── notifications/ # Test notifications
│   └── dashboard/        # Dashboard pages
├── components/            # React Components
├── lib/                   # Libraries
│   ├── scheduler.ts      # Notification scheduler
│   ├── cron.ts          # Cron jobs configuration
│   └── whatsapp.ts      # WhatsApp integration
├── prisma/               # Database schema
└── .env.local           # Environment variables
```

---

## 🛠️ NPM Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run seed         # Seed database
```

---

## 🔒 Keamanan & Deployment

### Development

- Jangan commit `.env.local` ke repository
- Gunakan `.env.example` sebagai template

### Production

1. **Build aplikasi**:

   ```bash
   npm run build
   npm start
   ```

2. **Set environment variables** di hosting provider

3. **Initialize cron jobs** setelah deploy:

   ```bash
   curl https://your-domain.com/api/cron/init
   ```

4. **Keep server running 24/7** agar cron jobs berjalan

---

## ❓ FAQ

### Q: Notifikasi WhatsApp tidak terkirim?

**A**: Pastikan:

- WhatsApp device terkoneksi di menu Pengaturan
- Nomor telepon guru/siswa terisi di database
- Cron jobs sudah di-initialize (`/api/cron/init`)
- Server tetap running

### Q: Bagaimana cara test notifikasi?

**A**: Gunakan endpoint `/api/notifications/test` dengan nomor WhatsApp Anda sendiri

### Q: Cron jobs tidak berjalan?

**A**:

- Pastikan sudah call `/api/cron/init`
- Server harus tetap running (jangan close terminal)
- Cek console logs untuk error

### Q: Format nomor WhatsApp?

**A**: Gunakan format `081234567890` (tanpa +62, tanpa spasi)

### Q: Notifikasi terkirim double?

**A**: Jangan call `/api/cron/init` lebih dari sekali. Restart server jika terjadi.

---

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

## 📄 License

Proprietary - RIO AGUSTIAN © 2025

# KasirKu Web

KasirKu Web adalah aplikasi Point of Sale berbasis web untuk membantu
operasional toko retail. Sistem mencakup pengelolaan produk dan mitra,
transaksi penjualan, pemantauan stok, dashboard analitik, serta pencetakan
struk.

Frontend dan backend dikembangkan sebagai aplikasi terpisah yang berkomunikasi
melalui REST API. Akses fitur dibatasi berdasarkan peran admin, kasir, dan
owner.

## Fitur Utama

- Authentication menggunakan JWT dan password hash bcrypt.
- Role-Based Access Control untuk admin, kasir, dan owner.
- Dashboard manajemen dan dashboard operasional kasir.
- Pengelolaan kategori, supplier, produk, dan pelanggan.
- Katalog produk dengan gambar, pencarian, harga, dan informasi stok.
- Transaksi penjualan dengan pelanggan opsional.
- Pembayaran tunai, transfer, QRIS, dan debit.
- Validasi stok, perhitungan total, pembayaran, dan kembalian.
- Riwayat penjualan, detail invoice, dan pencetakan struk.
- Grafik tren penjualan dalam rentang 7, 30, dan 90 hari.
- Redis caching untuk daftar produk dan ringkasan dashboard.
- Tema terang, gelap, dan mengikuti pengaturan perangkat.
- Antarmuka responsif untuk desktop dan perangkat dengan layar kecil.

## Hak Akses

| Modul | Admin | Kasir | Owner |
|---|:---:|:---:|:---:|
| Dashboard | Seluruh toko | Aktivitas sendiri | Seluruh toko |
| Kategori | Kelola | - | Lihat |
| Supplier | Kelola | - | Lihat |
| Produk | Kelola | Lihat melalui POS | Lihat |
| Pelanggan | Kelola | Kelola | Lihat |
| Transaksi baru | Buat | Buat | - |
| Riwayat penjualan | Lihat | Lihat | Lihat |

Backend tetap memverifikasi role pada setiap endpoint protected. Pembatasan menu
dan route pada frontend hanya menjadi lapisan pendukung pengalaman pengguna.

## Arsitektur

```text
Browser
  |
  v
React + TypeScript
  |
  | HTTPS / Axios / JSON / JWT
  v
Node.js + Express REST API
  |                         |
  | SQL                     | Cache
  v                         v
MySQL                     Redis
```

MySQL menjadi sumber data utama. Redis hanya digunakan sebagai cache sehingga
API tetap dapat berjalan langsung melalui MySQL ketika Redis tidak tersedia.

## Teknologi

### Frontend

- React 19 dan TypeScript
- Vite 8
- Tailwind CSS 4
- shadcn/ui dan Radix UI
- Redux Toolkit
- React Router
- Axios
- Recharts

### Backend

- Node.js 20+
- Express 5
- MySQL2
- Redis
- JSON Web Token
- bcryptjs
- Helmet
- express-rate-limit
- Vitest dan Supertest

## Struktur Repository

```text
pwl-pos-kasirku/
|-- backend/
|   |-- scripts/              # Script administrasi production
|   |-- src/
|   |   |-- config/           # Environment, MySQL, dan Redis
|   |   |-- controllers/      # Business logic
|   |   |-- middlewares/      # Auth, role, error, dan rate limit
|   |   |-- routes/           # REST API routes
|   |   `-- utils/            # JWT, cache, dan helper
|   `-- tests/                # Integration tests API
|-- database/
|   |-- schema.sql            # Struktur database
|   `-- seed.sql              # Data pengembangan
|-- docs/
|   |-- api-design.md
|   |-- database-design.md
|   |-- deployment.md
|   `-- requirements.md
`-- frontend/
    |-- public/
    `-- src/
        |-- api/              # Axios instance dan service
        |-- app/              # Routing dan route guard
        |-- components/       # Atomic Design components
        |-- pages/            # Halaman aplikasi
        |-- store/            # Redux store dan slices
        `-- lib/              # Utility dan access control
```

## Persyaratan

- Node.js 20 atau lebih baru
- npm
- MySQL 8 atau versi kompatibel
- Redis lokal atau Redis Cloud, opsional untuk pengembangan

## Menjalankan Secara Lokal

### 1. Clone Repository

```bash
git clone https://github.com/radincuyy/pwl-pos-kasirku.git
cd pwl-pos-kasirku
```

### 2. Siapkan Database

Buat database `pwl_pos`, kemudian jalankan schema dan seed:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pwl_pos"
mysql -u root -p pwl_pos < database/schema.sql
mysql -u root -p pwl_pos < database/seed.sql
```

File seed menyediakan data pengembangan berupa tiga role, tiga akun, kategori,
supplier, pelanggan, dan produk.

> Jangan menjalankan `database/seed.sql` pada production karena berisi akun dan
> password demo.

### 3. Jalankan Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Sesuaikan koneksi MySQL, JWT secret, dan Redis pada `backend/.env`. Backend
berjalan pada:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
GET http://localhost:5000/api/health/ready
```

### 4. Jalankan Frontend

Buka terminal baru:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Frontend berjalan pada `http://localhost:5173`.

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | `admin@kasirku.test` | `Admin12345` |
| Kasir | `kasir@kasirku.test` | `Admin12345` |
| Owner | `owner@kasirku.test` | `Admin12345` |

Akun tersebut hanya untuk lingkungan lokal dan demonstrasi.

## Environment Variables

Contoh lengkap tersedia pada:

- [`backend/.env.example`](backend/.env.example)
- [`frontend/.env.example`](frontend/.env.example)

Variable backend utama:

| Variable | Fungsi |
|---|---|
| `PORT` | Port HTTP backend |
| `FRONTEND_URL` | Origin frontend yang diizinkan oleh CORS |
| `DB_*` | Konfigurasi koneksi MySQL |
| `JWT_SECRET` | Secret penandatanganan JWT |
| `JWT_EXPIRES_IN` | Masa berlaku token |
| `REDIS_URL` | Connection string Redis |
| `REDIS_TTL_SECONDS` | TTL default cache |

Variable frontend:

| Variable | Fungsi |
|---|---|
| `VITE_API_URL` | Base URL REST API |

Jangan menyimpan file `.env`, password, token, sertifikat, atau connection
string ke repository.

## REST API

API menggunakan prefix `/api` dan menyediakan 30 endpoint untuk:

- Health dan readiness
- Authentication
- Dashboard
- Kategori
- Supplier
- Produk
- Pelanggan
- Transaksi penjualan

Dokumentasi endpoint dan matriks role tersedia di
[`docs/api-design.md`](docs/api-design.md).

## Pengujian

### Backend

```bash
cd backend
npm test
```

Test suite mencakup health check, authentication, authorization, CRUD data
utama, transaksi, dan cache.

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Keamanan dan Konsistensi Data

- Password disimpan menggunakan bcrypt.
- Endpoint protected menggunakan JWT.
- Otorisasi diverifikasi pada backend.
- Helmet, CORS allowlist, dan rate limiting diterapkan.
- Query database menggunakan parameter placeholder.
- Transaksi penjualan menggunakan MySQL transaction dan row locking.
- Koneksi MySQL production mendukung TLS.
- Environment production divalidasi sebelum server berjalan.

## Deployment

Frontend, backend, MySQL, dan Redis dapat dipasang sebagai layanan terpisah.
Konfigurasi production, pembuatan akun admin, TLS database, SPA fallback, dan
langkah verifikasi tersedia di
[`docs/deployment.md`](docs/deployment.md).

## Dokumentasi

- [Kebutuhan Sistem](docs/requirements.md)
- [Desain Database](docs/database-design.md)
- [Desain REST API](docs/api-design.md)
- [Panduan Deployment](docs/deployment.md)

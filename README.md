# KasirKu Web - Sistem Point of Sales

Aplikasi web Point of Sales untuk mengelola produk, stok, pelanggan, dan transaksi penjualan.

## Studi Kasus

KasirKu Web membantu operasional toko atau usaha retail melalui pengelolaan produk, kategori, supplier, pelanggan, transaksi penjualan, stok, dan dashboard ringkasan bisnis.

## Tech Stack

- Frontend: ReactJS + Vite + TypeScript
- UI Components: shadcn/ui (Radix + Nova)
- Styling: Tailwind CSS v4
- State Management: Redux Toolkit
- API Client: Axios
- Backend: NodeJS Express
- Database: MySQL
- Caching: Redis
- Authentication: JWT + bcrypt
- Version Control: Git + GitHub

## Arsitektur Singkat

```text
React Frontend -> Axios -> Express REST API -> MySQL
                                  |
                                  -> Redis Cache
```

## Struktur Project

```text
pwl-pos-kasirku/
|-- frontend/          # React + Vite + TypeScript
|   |-- src/
|   |   |-- api/       # Axios instance + service modules
|   |   |-- components/# shadcn/ui components
|   |   |-- hooks/     # Custom hooks
|   |   `-- lib/       # Utility functions
|   `-- public/
|-- backend/           # NodeJS Express REST API
|   `-- src/
|       |-- controllers/
|       |-- routes/
|       |-- middlewares/
|       |-- config/
|       `-- utils/
|-- database/          # Schema SQL + Seed data
`-- docs/              # Dokumentasi teknis
```

## Status Progress

### Backend
- [x] Setup backend Express
- [x] Setup koneksi database MySQL
- [x] Implementasi authentication (JWT + bcrypt)
- [x] Validasi schema dan seed di MySQL lokal
- [x] Implementasi CRUD kategori
- [x] Implementasi CRUD supplier
- [x] Implementasi CRUD produk
- [x] Implementasi CRUD pelanggan
- [x] Implementasi transaksi penjualan
- [x] Implementasi Redis caching (dashboard + produk)
- [x] Implementasi endpoint dashboard summary

### Frontend
- [x] Setup frontend React + Vite + TypeScript
- [x] Integrasi Tailwind CSS v4
- [x] Integrasi shadcn/ui (17 komponen)
- [x] Setup Axios instance dan interceptors
- [x] Implementasi API service modules (7 modul)
- [ ] Implementasi Redux store dan slices
- [ ] Implementasi layout dan routing
- [ ] Implementasi halaman login
- [ ] Implementasi halaman dashboard
- [ ] Implementasi halaman CRUD (produk, kategori, supplier, pelanggan)
- [ ] Implementasi halaman transaksi POS
- [ ] Integrasi frontend-backend

### Dokumentasi & Lainnya
- [x] Menentukan studi kasus: Sistem Point of Sales
- [x] Membuat repository awal
- [x] Menyiapkan dokumen requirement awal
- [x] Membuat draft desain database
- [x] Membuat ERD final
- [ ] Finalisasi laporan (BAB IV, VI, VII, VIII)
- [ ] Slide presentasi
- [ ] Video demo
- [ ] Testing

## Branch Workflow

- `main`: branch stabil untuk submission/release
- `develop`: branch utama pengembangan bertahap
- `feature/*`: branch fitur yang di-merge ke develop

### Riwayat Branch

| Branch | Status |
|---|---|
| `feature-backend-auth` | ✅ Merged |
| `feature-backend-categories` | ✅ Merged |
| `feature-backend-suppliers` | ✅ Merged |
| `feature-backend-products` | ✅ Merged |
| `feature-backend-customers` | ✅ Merged |
| `feature-backend-sales` | ✅ Merged |
| `feature-backend-redis-cache` | ✅ Merged |
| `feature/frontend-setup` | ✅ Merged |
| `feature/api-layer` | ✅ Merged |

## Cara Menjalankan

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Sesuaikan .env dengan konfigurasi MySQL dan Redis lokal
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

## Catatan

Project ini dikembangkan bertahap agar setiap perubahan mudah ditinjau dan diuji.

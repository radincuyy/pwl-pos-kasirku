# KasirKu Web - Sistem Point of Sales

Aplikasi web Point of Sales untuk mengelola produk, stok, pelanggan, dan transaksi penjualan.

## Studi Kasus

KasirKu Web membantu operasional toko atau usaha retail melalui pengelolaan produk, kategori, supplier, pelanggan opsional, transaksi penjualan, stok, dan dashboard ringkasan bisnis.

## Tech Stack

- Frontend: ReactJS + Vite + TypeScript
- UI Components: shadcn/ui (Radix + Nova)
- Styling: Tailwind CSS v4
- State Management: Redux Toolkit
- API Client: Axios
- Backend: NodeJS Express
- Database: MySQL
- Caching: Redis
- Authentication: JWT + bcrypt + Role-Based Access Control
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
|   |   |-- app/       # Root aplikasi dan route guard
|   |   |-- api/       # Axios instance + service modules
|   |   |-- components/# Atomic Design components
|   |   |   |-- atoms/      # Primitive shadcn/ui
|   |   |   |-- molecules/  # Komponen interaksi kecil
|   |   |   |-- organisms/  # Form, navigasi, dan bagian fitur
|   |   |   `-- templates/  # Layout halaman
|   |   |-- hooks/     # Custom hooks
|   |   |-- lib/       # Utility functions
|   |   |-- pages/     # Halaman aplikasi
|   |   `-- store/     # Redux store dan slices
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

### Fase Saat Ini

Project saat ini berada di **Phase 8: Pengujian Akhir dan Stabilisasi**. Seluruh fitur inti sudah diimplementasikan dan lolos validasi otomatis, smoke test API, serta pengujian koneksi Redis. Pekerjaan teknis yang tersisa adalah pengujian end-to-end secara manual pada browser untuk setiap role dan perbaikan jika ditemukan masalah.

### Backend

- [x] Setup backend Express
- [x] Setup koneksi database MySQL
- [x] Implementasi authentication (JWT + bcrypt)
- [x] Implementasi otorisasi berbasis role (admin, kasir, owner)
- [x] Validasi schema dan seed di MySQL lokal
- [x] Implementasi CRUD kategori
- [x] Implementasi CRUD supplier
- [x] Implementasi CRUD produk
- [x] Implementasi CRUD pelanggan
- [x] Implementasi transaksi penjualan
- [x] Implementasi Redis caching (dashboard + produk)
- [x] Implementasi endpoint dashboard admin/owner dan kasir

### Frontend

- [x] Setup frontend React + Vite + TypeScript
- [x] Integrasi Tailwind CSS v4
- [x] Integrasi shadcn/ui (17 komponen)
- [x] Setup Axios instance dan interceptors
- [x] Implementasi API service modules (7 modul)
- [x] Implementasi Redux store dan slices
- [x] Implementasi layout dan routing
- [x] Implementasi route, menu, dan mode read-only berbasis role
- [x] Implementasi halaman login
- [x] Implementasi dashboard manajemen dan dashboard operasional kasir
- [x] Integrasi awal frontend-backend (login + dashboard)
- [x] Implementasi halaman CRUD (produk, kategori, supplier, pelanggan)
- [x] Implementasi halaman transaksi POS
- [x] Integrasi frontend-backend modul produk, kategori, supplier, dan pelanggan
- [x] Integrasi frontend-backend modul transaksi
- [x] Perbaikan build dan lint frontend

### Dokumentasi & Lainnya

- [x] Menentukan studi kasus: Sistem Point of Sales
- [x] Membuat repository awal
- [x] Menyiapkan dokumen requirement awal
- [x] Membuat draft desain database
- [x] Membuat ERD final
- [x] Testing backend automated
- [x] Validasi build dan lint frontend
- [x] Smoke test API dan Redis
- [x] Audit dependency production
- [x] Deployment hardening dan konfigurasi SPA
- [ ] Deploy staging
- [ ] Finalisasi laporan (BAB IV, VI, VII, VIII)
- [ ] Slide presentasi
- [ ] Video demo
- [ ] Testing end-to-end/manual flow

### Status Validasi

- Backend: `npm test` berhasil dengan 8 file test dan 33 test passed.
- Frontend: `npm run build` dan `npm run lint` berhasil. Halaman login, dashboard, CRUD data, transaksi POS, riwayat penjualan, dan detail invoice sudah tersedia.
- Integrasi: login dan dashboard untuk role admin, kasir, dan owner, endpoint pelanggan, serta invalidasi cache Redis berhasil diuji.
- Keamanan dependency: `npm audit --omit=dev` pada backend dan frontend tidak menemukan kerentanan.

## Branch Workflow

- `main`: branch stabil untuk submission/release
- `develop`: branch utama pengembangan bertahap
- `feature/*`: branch fitur yang di-merge ke develop

### Riwayat Branch

| Branch | Status |
|---|---|
| `feature-backend-auth` | Merged |
| `feature-backend-categories` | Merged |
| `feature-backend-suppliers` | Merged |
| `feature-backend-products` | Merged |
| `feature-backend-customers` | Merged |
| `feature-backend-sales` | Merged |
| `feature-backend-redis-cache` | Merged |
| `feature/frontend-setup` | Merged |
| `feature/api-layer` | Merged |
| `feature/redux-store` | Merged |
| `feature/redux-slices` | Merged |
| `feature/layout-dashboard-sidebar` | Merged |
| `feature/protected-route-konfigurasi-routing` | Merged |
| `feature/auth-page` | Merged |
| `feature/dashboard-page` | Merged |
| `feature/crud-pages` | Implemented |
| `feature/sales-pages` | Merged |
| `feature/rbac` | Merged |

## Cara Menjalankan

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Sesuaikan .env dengan konfigurasi MySQL dan Redis
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
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pwl_pos"
mysql -u root -p pwl_pos < database/schema.sql
mysql -u root -p pwl_pos < database/seed.sql
```

## Catatan

Project ini dikembangkan bertahap agar setiap perubahan mudah ditinjau dan diuji.
Panduan deployment production tersedia di
[`docs/deployment.md`](docs/deployment.md).

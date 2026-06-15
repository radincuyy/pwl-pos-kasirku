# KasirKu Web - Sistem Point of Sales

Aplikasi web Point of Sales untuk mengelola produk, stok, pelanggan, dan transaksi penjualan.

## Studi Kasus

KasirKu Web membantu operasional toko atau usaha retail melalui pengelolaan produk, kategori, supplier, pelanggan, transaksi penjualan, stok, dan dashboard ringkasan bisnis.

## Tech Stack

- Frontend: ReactJS + Vite
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
|-- frontend/
|-- backend/
|-- database/
`-- docs/
```

## Status Progress

- [x] Menentukan studi kasus: Sistem Point of Sales
- [x] Membuat repository awal
- [x] Menyiapkan dokumen requirement awal
- [x] Membuat draft desain database
- [ ] Membuat ERD final
- [x] Setup backend Express
- [x] Setup koneksi database MySQL
- [x] Implementasi authentication
- [x] Validasi schema dan seed di MySQL lokal
- [x] Implementasi CRUD modul master
- [x] Implementasi transaksi penjualan
- [x] Implementasi Redis caching
- [ ] Setup frontend React
- [ ] Integrasi frontend-backend dengan Axios
- [ ] Testing

## Branch Workflow

- `main`: branch stabil untuk submission/release
- `develop`: branch utama pengembangan bertahap

## Catatan

Project ini dikembangkan bertahap agar setiap perubahan mudah ditinjau dan diuji.

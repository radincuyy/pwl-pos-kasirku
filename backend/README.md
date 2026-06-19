# KasirKu Backend

Backend REST API untuk aplikasi **KasirKu Web** dengan NodeJS Express.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server backend membutuhkan MySQL sesuai konfigurasi `.env`. Redis dipakai untuk cache dan bisa memakai Redis lokal atau Redis Cloud.

## Setup Database

Siapkan database lokal, lalu jalankan schema dan seed awal:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pwl_pos"
mysql -u root -p pwl_pos < ../database/schema.sql
mysql -u root -p pwl_pos < ../database/seed.sql
```

Seed awal membuat data pengujian berupa 3 akun, 5 kategori, 4 supplier,
5 pelanggan, dan 12 produk dengan variasi stok normal, rendah, dan habis.

```text
admin@kasirku.test / Admin12345
kasir@kasirku.test / Admin12345
owner@kasirku.test / Admin12345
```

## Setup Redis

Untuk Redis lokal, jalankan Redis pada host dan port sesuai `.env`:

```text
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL_SECONDS=300
```

Untuk Redis Cloud, gunakan connection string dari dashboard Redis Cloud pada `.env` lokal:

```text
REDIS_URL=redis://default:<password>@<host>:<port>
REDIS_TTL_SECONDS=300
```

Jangan menyimpan nilai `REDIS_URL` asli ke repository karena berisi password database Redis.

Cache Redis dipakai untuk `GET /api/products`, `GET /api/dashboard/summary`, dan dibersihkan saat data produk, kategori, supplier, atau transaksi penjualan berubah.

## Hak Akses

| Modul | Admin | Kasir | Owner |
|---|---|---|---|
| Dashboard | Lihat | Lihat aktivitas sendiri | Lihat |
| Kategori dan supplier | Kelola | - | Lihat |
| Produk | Kelola | Lihat melalui POS | Lihat |
| Pelanggan | Kelola | Kelola | Lihat |
| Transaksi baru | Buat | Buat | - |
| Riwayat penjualan | Lihat | Lihat | Lihat |

Request dengan role yang tidak memiliki izin akan mendapatkan response `403 Forbidden`.

## Scripts

```bash
npm run dev     # menjalankan server dengan nodemon
npm start       # menjalankan server production/local biasa
npm test        # menjalankan automated test
```

## Endpoint

```text
GET    /api/health
GET    /api/health/ready
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
GET    /api/dashboard/summary    (Redis cached)
GET    /api/dashboard/cashier-summary
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
GET    /api/suppliers
POST   /api/suppliers
GET    /api/suppliers/:id
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
GET    /api/products             (Redis cached)
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id
GET    /api/sales
POST   /api/sales
GET    /api/sales/:id
```

Total: 30 endpoint.

Base URL local:

```text
http://localhost:5000
```

Response sukses:

```json
{
  "success": true,
  "message": "KasirKu API is running",
  "data": {
    "service": "kasirku-api",
    "status": "healthy"
  }
}
```

## Deployment

Panduan environment production, MySQL cloud, health check, dan pembuatan admin
tersedia di [`docs/deployment.md`](../docs/deployment.md).

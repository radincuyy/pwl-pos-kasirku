# API Design - KasirKu Web

Base URL lokal:

```text
http://localhost:5000/api
```

Base URL production mengikuti URL Render:

```text
https://<render-service>.onrender.com/api
```

Endpoint protected menggunakan:

```text
Authorization: Bearer <token>
```

## Format Response

Response berhasil:

```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

Response gagal:

```json
{
  "success": false,
  "message": "Pesan kesalahan"
}
```

Status utama: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `429`, dan
`500`.

## Matriks Hak Akses

| Endpoint | Admin | Kasir | Owner |
|---|:---:|:---:|:---:|
| `/dashboard/summary` | Baca | - | Baca |
| `/dashboard/cashier-summary` | - | Data sendiri | - |
| `GET /categories/*` | Baca | - | Baca |
| `POST/PUT/DELETE /categories/*` | Tulis | - | - |
| `GET /suppliers/*` | Baca | - | Baca |
| `POST/PUT/DELETE /suppliers/*` | Tulis | - | - |
| `GET /products/*` | Baca | Baca | Baca |
| `POST/PUT/DELETE /products/*` | Tulis | - | - |
| `GET /customers/*` | Baca | Baca | Baca |
| `POST/PUT/DELETE /customers/*` | Tulis | Tulis | - |
| `GET /sales/*` | Baca | Baca | Baca |
| `POST /sales` | Buat | Buat | - |

Token tidak valid menghasilkan `401`, sedangkan role tanpa izin menghasilkan
`403`.

## Health

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|:---:|
| GET | `/health` | Memastikan proses API hidup | Tidak |
| GET | `/health/ready` | Memastikan MySQL siap dan melaporkan status Redis | Tidak |

## Authentication

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|:---:|
| POST | `/auth/login` | Login dan menghasilkan JWT | Tidak |
| GET | `/auth/me` | Mengambil pengguna aktif | Ya |
| POST | `/auth/logout` | Mengonfirmasi logout | Ya |

## Dashboard

| Method | Endpoint | Deskripsi | Role | Cache |
|---|---|---|---|:---:|
| GET | `/dashboard/summary` | Produk, transaksi, pendapatan, stok rendah, penjualan terbaru, dan tren | Admin, owner | Redis 60 detik |
| GET | `/dashboard/cashier-summary` | Transaksi, pendapatan, item, penjualan terbaru, dan tren kasir aktif | Kasir | Tidak |

## Categories

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/categories` | Daftar kategori | Admin, owner |
| GET | `/categories/:id` | Detail kategori | Admin, owner |
| POST | `/categories` | Membuat kategori | Admin |
| PUT | `/categories/:id` | Mengubah kategori | Admin |
| DELETE | `/categories/:id` | Menghapus kategori | Admin |

## Suppliers

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/suppliers` | Daftar supplier | Admin, owner |
| GET | `/suppliers/:id` | Detail supplier | Admin, owner |
| POST | `/suppliers` | Membuat supplier | Admin |
| PUT | `/suppliers/:id` | Mengubah supplier | Admin |
| DELETE | `/suppliers/:id` | Menghapus supplier | Admin |

## Products

| Method | Endpoint | Deskripsi | Role | Cache |
|---|---|---|---|:---:|
| GET | `/products` | Daftar produk | Semua role | Redis |
| GET | `/products/:id` | Detail produk | Semua role | Tidak |
| POST | `/products` | Membuat produk | Admin | Invalidasi |
| PUT | `/products/:id` | Mengubah produk | Admin | Invalidasi |
| DELETE | `/products/:id` | Menghapus produk | Admin | Invalidasi |

## Customers

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/customers` | Daftar pelanggan | Semua role |
| GET | `/customers/:id` | Detail pelanggan | Semua role |
| POST | `/customers` | Membuat pelanggan | Admin, kasir |
| PUT | `/customers/:id` | Mengubah pelanggan | Admin, kasir |
| DELETE | `/customers/:id` | Menghapus pelanggan | Admin, kasir |

## Sales

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| GET | `/sales` | Riwayat penjualan | Semua role |
| GET | `/sales/:id` | Detail penjualan | Semua role |
| POST | `/sales` | Membuat transaksi penjualan | Admin, kasir |

Pembuatan transaksi mengambil harga dari database, memvalidasi stok, menyimpan
detail item, mengurangi stok, mencatat stock movement, dan menghapus cache
produk serta dashboard.

## Ringkasan Endpoint

| Kelompok | Jumlah |
|---|---:|
| Health | 2 |
| Authentication | 3 |
| Dashboard | 2 |
| Categories | 5 |
| Suppliers | 5 |
| Products | 5 |
| Customers | 5 |
| Sales | 3 |
| **Total** | **30** |

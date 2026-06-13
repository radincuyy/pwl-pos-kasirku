# API Design — KasirKu Web

Base URL local:

```text
http://localhost:5001/api
```

## Health Check

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/health` | Mengecek status backend API | No |

## Auth

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/auth/login` | Login user dan menghasilkan JWT | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Mengambil data user login | Yes |

## Dashboard

| Method | Endpoint | Deskripsi | Auth | Cache |
|---|---|---|---|---|
| GET | `/dashboard/summary` | Ringkasan total produk, transaksi, pendapatan, stok rendah | Yes | Redis |

## Products

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/products` | List produk | Yes |
| POST | `/products` | Tambah produk | Yes |
| GET | `/products/:id` | Detail produk | Yes |
| PUT | `/products/:id` | Update produk | Yes |
| DELETE | `/products/:id` | Hapus produk | Yes |

## Categories

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/categories` | List kategori | Yes |
| POST | `/categories` | Tambah kategori | Yes |
| GET | `/categories/:id` | Detail kategori | Yes |
| PUT | `/categories/:id` | Update kategori | Yes |
| DELETE | `/categories/:id` | Hapus kategori | Yes |

## Suppliers

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/suppliers` | List supplier | Yes |
| POST | `/suppliers` | Tambah supplier | Yes |
| GET | `/suppliers/:id` | Detail supplier | Yes |
| PUT | `/suppliers/:id` | Update supplier | Yes |
| DELETE | `/suppliers/:id` | Hapus supplier | Yes |

## Customers

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/customers` | List pelanggan | Yes |
| POST | `/customers` | Tambah pelanggan | Yes |
| PUT | `/customers/:id` | Update pelanggan | Yes |
| DELETE | `/customers/:id` | Hapus pelanggan | Yes |

## Sales / Transactions

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/sales` | Riwayat transaksi | Yes |
| POST | `/sales` | Membuat transaksi penjualan | Yes |
| GET | `/sales/:id` | Detail transaksi | Yes |

Total endpoint awal: 27 endpoint.

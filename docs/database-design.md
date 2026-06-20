# Database Design - KasirKu Web

KasirKu Web menggunakan MySQL dengan sepuluh tabel. Nama database lokal adalah
`pwl_pos`; nama database production mengikuti konfigurasi Aiven.

## Daftar Tabel

| Tabel | Fungsi |
|---|---|
| `roles` | Menyimpan role admin, kasir, dan owner |
| `users` | Menyimpan akun dan password hash |
| `categories` | Menyimpan kategori produk |
| `suppliers` | Menyimpan data supplier |
| `products` | Menyimpan produk, harga, gambar, stok, dan batas minimum |
| `customers` | Menyimpan pelanggan opsional |
| `sales` | Menyimpan header transaksi dan pembayaran |
| `sale_items` | Menyimpan detail produk pada transaksi |
| `stock_movements` | Mencatat perubahan stok dan referensi penjualan |
| `activity_logs` | Disediakan untuk pengembangan audit log berikutnya |

## Relasi

| Foreign Key | Referensi |
|---|---|
| `users.role_id` | `roles.id` |
| `products.category_id` | `categories.id` |
| `products.supplier_id` | `suppliers.id` |
| `sales.user_id` | `users.id` |
| `sales.customer_id` | `customers.id` |
| `sale_items.sale_id` | `sales.id` |
| `sale_items.product_id` | `products.id` |
| `stock_movements.product_id` | `products.id` |
| `stock_movements.sale_id` | `sales.id` |
| `stock_movements.created_by` | `users.id` |
| `activity_logs.user_id` | `users.id` |

`sales.customer_id`, `stock_movements.sale_id`, dan `activity_logs.user_id`
bersifat nullable sesuai kebutuhan proses.

## Ketentuan Kolom

- Primary key menggunakan `BIGINT UNSIGNED AUTO_INCREMENT`.
- Harga dan nominal pembayaran menggunakan `DECIMAL(12,2)`.
- `products.sku` dan `sales.invoice_number` bersifat unik.
- `products.image_url` dapat menyimpan URL gambar hingga 2048 karakter.
- `sales.payment_method` menerima `cash`, `transfer`, `qris`, atau `debit`.
- `sales.status` menerima `paid` atau `cancelled`.
- `stock_movements.type` menerima `in` atau `out`.
- Tabel utama menggunakan `created_at` dan `updated_at`.
- Password disimpan pada `users.password_hash` menggunakan bcrypt.

## Konsistensi Transaksi

Pembuatan penjualan menggunakan MySQL transaction:

1. Backend memulai transaction.
2. Produk dibaca menggunakan `SELECT ... FOR UPDATE`.
3. Stok dan nominal pembayaran divalidasi.
4. Data disimpan ke `sales` dan `sale_items`.
5. Stok produk dikurangi.
6. Perubahan disimpan pada `stock_movements`.
7. Seluruh perubahan di-commit atau di-rollback sebagai satu kesatuan.

## Schema dan Seed

- Schema final: [`../database/schema.sql`](../database/schema.sql)
- Data pengembangan: [`../database/seed.sql`](../database/seed.sql)

Seed menyediakan tiga akun demo, lima kategori, empat supplier, lima pelanggan,
dan dua belas produk. Seed tidak digunakan pada production.

## Database Production

Database production menggunakan Aiven MySQL dengan TLS. Backend membaca host,
port, nama database, user, password, dan sertifikat CA melalui environment
variable. Credential dan sertifikat tidak disimpan pada repository.

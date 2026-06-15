# Database Design - KasirKu Web

Database: `pwl_pos`

## Daftar Tabel Minimal

1. `roles`
2. `users`
3. `categories`
4. `suppliers`
5. `products`
6. `customers`
7. `sales`
8. `sale_items`
9. `stock_movements`
10. `activity_logs`

## Relasi Utama

- `users.role_id` -> `roles.id`
- `products.category_id` -> `categories.id`
- `products.supplier_id` -> `suppliers.id`
- `sales.user_id` -> `users.id`
- `sales.customer_id` -> `customers.id`
- `sale_items.sale_id` -> `sales.id`
- `sale_items.product_id` -> `products.id`
- `stock_movements.product_id` -> `products.id`
- `stock_movements.sale_id` -> `sales.id`
- `stock_movements.created_by` -> `users.id`
- `activity_logs.user_id` -> `users.id`

## Catatan Implementasi

- Semua tabel utama memakai `created_at` dan `updated_at`.
- Password user wajib disimpan dalam bentuk hash bcrypt.
- Stok produk berubah melalui transaksi dan dicatat pada `stock_movements`.
- `sales.payment_method` menyimpan metode pembayaran transaksi: `cash`, `transfer`, `qris`, atau `debit`.
- `sales.status` menyimpan status transaksi: `paid` atau `cancelled`.
- `stock_movements.sale_id` digunakan agar riwayat stok keluar dapat ditelusuri ke transaksi penjualan.
- Dashboard summary dapat mengambil agregasi dari tabel `products`, `sales`, dan `sale_items`, lalu dicache memakai Redis.

# Requirements — Sistem Point of Sales

## Deskripsi Singkat

KasirKu Web adalah aplikasi Point of Sales berbasis web untuk membantu admin/kasir mengelola data produk, kategori, supplier, pelanggan opsional, stok barang, dan transaksi penjualan.

## Aktor

| Aktor | Deskripsi | Hak Akses Utama |
|---|---|---|
| Admin | Pengelola sistem | Kelola user, produk, kategori, supplier, pelanggan, transaksi, dashboard |
| Kasir | Pengguna operasional penjualan | Login, melihat produk, membuat transaksi penjualan |
| Owner/Manager | Pemilik/pengawas bisnis | Melihat dashboard dan laporan/ringkasan transaksi |

## Kebutuhan Fungsional

1. User dapat login menggunakan email dan password.
2. User dapat logout dari sistem.
3. Sistem dapat menampilkan dashboard ringkasan.
4. Admin dapat mengelola data kategori produk.
5. Admin dapat mengelola data supplier.
6. Admin dapat mengelola data produk.
7. Admin/kasir dapat mengelola data pelanggan opsional.
8. Kasir dapat membuat transaksi penjualan.
9. Sistem dapat menyimpan detail item transaksi.
10. Sistem dapat mengurangi stok produk setelah transaksi berhasil.
11. Sistem dapat menampilkan riwayat transaksi.
12. Sistem dapat menampilkan produk dengan stok rendah.

## Kebutuhan Non-Fungsional

1. Frontend dan backend dibuat terpisah.
2. Komunikasi data menggunakan REST API berbasis JSON.
3. Frontend menggunakan ReactJS.
4. State management menggunakan Redux Toolkit.
5. Backend menggunakan NodeJS Express.
6. Database menggunakan MySQL.
7. Caching menggunakan Redis.
8. Password user disimpan dalam bentuk hash.
9. Endpoint protected wajib menggunakan JWT authentication.
10. Project menggunakan Git dan GitHub untuk version control.

## Modul Utama

- Authentication
- Dashboard
- Products
- Categories
- Suppliers
- Customers
- Sales / Transactions
- Stock Movements

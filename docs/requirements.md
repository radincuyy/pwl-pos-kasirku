# Requirements - KasirKu Web

## Deskripsi Sistem

KasirKu Web adalah aplikasi Point of Sale berbasis web untuk operasional toko
retail. Sistem mengelola kategori, supplier, produk, pelanggan opsional,
transaksi penjualan, stok, dan ringkasan penjualan.

Frontend React dan backend Express dipasang sebagai layanan terpisah. Frontend
berkomunikasi dengan backend melalui REST API, sedangkan backend menggunakan
MySQL sebagai sumber data utama dan Redis sebagai cache.

## Aktor dan Hak Akses

| Aktor | Tanggung Jawab | Hak Akses |
|---|---|---|
| Admin | Mengelola data utama dan mengawasi operasional | Dashboard global, CRUD kategori, supplier, produk, dan pelanggan, membuat transaksi, melihat riwayat |
| Kasir | Menjalankan transaksi penjualan | Dashboard pribadi, membaca produk, CRUD pelanggan, membuat transaksi, melihat riwayat |
| Owner | Memantau kondisi dan hasil usaha | Dashboard global serta akses baca kategori, supplier, produk, pelanggan, dan penjualan |

Pembatasan akses diterapkan pada frontend dan backend. Backend menjadi lapisan
otorisasi utama dan mengembalikan status `403` untuk role yang tidak memiliki
izin.

## Kebutuhan Fungsional

| Kode | Kebutuhan |
|---|---|
| KF-01 | Pengguna dapat login menggunakan email dan password. |
| KF-02 | Sistem dapat memvalidasi sesi dan menampilkan data pengguna aktif. |
| KF-03 | Pengguna dapat logout. |
| KF-04 | Admin dan owner dapat melihat dashboard seluruh toko. |
| KF-05 | Kasir dapat melihat dashboard transaksi miliknya sendiri. |
| KF-06 | Admin dapat melakukan CRUD kategori, supplier, dan produk. |
| KF-07 | Owner dapat membaca kategori, supplier, dan produk tanpa mengubah data. |
| KF-08 | Admin dan kasir dapat melakukan CRUD pelanggan. |
| KF-09 | Semua role dapat melihat pelanggan dan riwayat penjualan. |
| KF-10 | Admin dan kasir dapat membuat transaksi penjualan. |
| KF-11 | Pelanggan pada transaksi dapat dikosongkan sebagai pelanggan umum. |
| KF-12 | Sistem memvalidasi item, jumlah, stok, dan nominal pembayaran. |
| KF-13 | Sistem menghitung total transaksi dan kembalian. |
| KF-14 | Sistem menyimpan header transaksi dan detail item. |
| KF-15 | Sistem mengurangi stok dan mencatat pergerakan stok. |
| KF-16 | Sistem menampilkan detail invoice dan mencetak struk. |
| KF-17 | Dashboard menampilkan metrik, stok rendah, transaksi terbaru, dan tren penjualan. |
| KF-18 | Pengguna dapat memilih tema light, dark, atau system. |

## Kebutuhan Non-Fungsional

| Kode | Aspek | Kebutuhan |
|---|---|---|
| KNF-01 | Arsitektur | Frontend dan backend dipisahkan dan berkomunikasi melalui REST API JSON. |
| KNF-02 | State | Informasi pengguna, authentication, data domain, dan transaksi dikelola dengan Redux Toolkit. |
| KNF-03 | Keamanan | Password disimpan dengan bcrypt dan endpoint protected menggunakan JWT. |
| KNF-04 | Otorisasi | Hak akses diverifikasi berdasarkan role pada backend. |
| KNF-05 | Database | Data disimpan pada MySQL dengan foreign key dan transaction. |
| KNF-06 | Performa | Daftar produk dan dashboard global menggunakan Redis cache. |
| KNF-07 | Keandalan | Kegagalan Redis tidak menghentikan fungsi utama yang menggunakan MySQL. |
| KNF-08 | Responsivitas | Antarmuka dapat digunakan pada desktop dan layar kecil. |
| KNF-09 | Kompatibilitas | Runtime menggunakan Node.js 20 atau lebih baru dan browser modern. |
| KNF-10 | Deployment | Frontend dipasang pada Vercel, backend pada Render, database pada Aiven MySQL, dan cache pada Redis Cloud. |
| KNF-11 | Transport | Komunikasi production menggunakan HTTPS dan koneksi MySQL menggunakan TLS. |
| KNF-12 | Maintainability | Kode dipisahkan menjadi route, controller, middleware, service, store, dan komponen. |

## Aturan Bisnis

1. Hanya admin dan kasir yang dapat membuat transaksi.
2. Harga transaksi diambil dari database oleh backend.
3. Jumlah item harus berupa bilangan bulat positif.
4. Transaksi ditolak apabila stok tidak mencukupi.
5. Nominal pembayaran tidak boleh lebih kecil dari total transaksi.
6. Pembayaran non-tunai dicatat menggunakan nominal pas.
7. Satu transaksi menghasilkan satu nomor invoice unik.
8. Penjualan, detail item, perubahan stok, dan stock movement disimpan dalam
   satu transaction MySQL.
9. Perubahan produk atau penjualan menghapus cache terkait.

## Modul Sistem

- Authentication
- Dashboard
- Categories
- Suppliers
- Products
- Customers
- Sales
- Stock Movements
- Receipt Printing
- Theme Management

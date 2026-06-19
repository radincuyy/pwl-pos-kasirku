# Deployment KasirKu

KasirKu dipasang sebagai tiga layanan terpisah:

1. Frontend statis React/Vite.
2. Backend Node.js/Express.
3. MySQL, dengan Redis sebagai cache opsional.

Gunakan Node.js 20 atau yang lebih baru.

## Persiapan Keamanan

- Rotasi credential Redis yang pernah dibagikan melalui chat atau screenshot.
- Gunakan `JWT_SECRET` acak minimal 32 karakter.
- Jangan menjalankan `database/seed.sql` pada production karena berisi akun demo.
- Simpan seluruh credential melalui environment variables layanan hosting.
- Gunakan user MySQL khusus aplikasi dengan akses hanya ke database KasirKu.

## Database Production

Buat database kosong melalui penyedia MySQL, lalu jalankan schema terhadap database
yang sudah dipilih:

```bash
mysql --host=<host> --port=<port> --user=<user> --password <database> < database/schema.sql
```

Jika penyedia mewajibkan TLS, aktifkan `DB_SSL=true`. Isi
`DB_SSL_CA_BASE64` dengan sertifikat CA dalam format base64 bila disediakan.

## Backend

Gunakan folder `backend` sebagai root layanan.

```text
Build command: npm ci
Start command: npm start
Health check: /api/health/ready
```

Environment production yang wajib:

```text
NODE_ENV=production
HOST=0.0.0.0
FRONTEND_URL=https://alamat-frontend.example
TRUST_PROXY=1
DB_HOST=<mysql-host>
DB_PORT=3306
DB_NAME=<mysql-database>
DB_USER=<mysql-user>
DB_PASSWORD=<mysql-password>
JWT_SECRET=<nilai-acak-minimal-32-karakter>
JWT_EXPIRES_IN=1d
```

Tambahkan `REDIS_URL` jika Redis digunakan. API tetap berjalan langsung ke MySQL
jika Redis tidak tersedia.

Setelah schema tersedia, buat akun admin production melalui one-time command:

```bash
ADMIN_NAME="Administrator" \
ADMIN_EMAIL="admin@example.com" \
ADMIN_PASSWORD="<password-kuat>" \
npm run create:admin
```

Hapus `ADMIN_PASSWORD` dari environment layanan setelah perintah berhasil.

## Frontend

Gunakan folder `frontend` sebagai root layanan.

```text
Build command: npm ci && npm run build
Publish directory: dist
```

Atur URL backend sebelum build:

```text
VITE_API_URL=https://alamat-backend.example/api
```

File `public/_redirects` menangani SPA fallback pada Netlify/Cloudflare Pages.
File `vercel.json` menangani fallback yang sama pada Vercel.

## Verifikasi

1. Buka `GET /api/health` untuk memastikan proses API hidup.
2. Buka `GET /api/health/ready` untuk memastikan koneksi MySQL siap.
3. Login menggunakan akun admin production.
4. Uji hak akses admin, kasir, dan owner.
5. Buat transaksi dan pastikan stok, dashboard, chart, serta struk berubah.
6. Pastikan refresh pada route seperti `/products` tidak menghasilkan 404.

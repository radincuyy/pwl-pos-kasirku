# Deployment KasirKu

KasirKu menggunakan empat layanan cloud:

| Komponen | Penyedia |
|---|---|
| Frontend React/Vite | Vercel |
| Backend Node.js/Express | Render Web Service |
| Database MySQL | Aiven |
| Cache Redis | Redis Cloud |

Gunakan branch `main` sebagai sumber deployment.

## 1. Persiapan Keamanan

- Gunakan `JWT_SECRET` acak minimal 32 karakter.
- Jangan menjalankan `database/seed.sql` pada production.
- Jangan menyimpan `.env`, sertifikat, password, atau connection string pada
  repository.
- Buat akun admin production melalui script `create:admin`.
- Hapus `ADMIN_PASSWORD` dari environment setelah akun berhasil dibuat.
- Rotasi credential yang pernah terlihat pada chat, screenshot, atau log.

## 2. Aiven MySQL

### 2.1 Membuat Schema

Gunakan data koneksi dari halaman Aiven Service Overview. Jalankan schema pada
database yang dipilih:

```bash
mysql --host=<aiven-host> --port=<aiven-port> --user=<aiven-user> \
  --password <aiven-database> < database/schema.sql
```

Jangan menjalankan `seed.sql` pada production.

### 2.2 Sertifikat TLS

Unduh CA certificate dari Aiven, lalu ubah ke base64 untuk environment Render.

PowerShell:

```powershell
[Convert]::ToBase64String(
  [IO.File]::ReadAllBytes("C:\path\to\ca.pem")
)
```

Simpan hasilnya sebagai `DB_SSL_CA_BASE64`. Jangan menambahkan `ca.pem` ke
repository.

## 3. Redis Cloud

Buat database Redis Cloud dan salin connection string yang diberikan penyedia.
Simpan URI lengkap sebagai:

```text
REDIS_URL=<redis-cloud-connection-string>
```

Gunakan URI persis dari Redis Cloud, termasuk skema, username, password, host,
dan port. Backend dapat berjalan tanpa Redis, tetapi production KasirKu
menggunakan Redis Cloud untuk cache produk dan dashboard.

## 4. Backend pada Render

### 4.1 Membuat Web Service

1. Pilih **New > Web Service** pada Render.
2. Hubungkan repository GitHub KasirKu.
3. Pilih branch `main`.
4. Gunakan konfigurasi berikut:

```text
Root Directory: backend
Runtime: Node
Build Command: npm ci
Start Command: npm start
Health Check Path: /api/health/ready
```

Backend sudah membaca environment `PORT` yang disediakan Render dan bind ke
`HOST=0.0.0.0`. Port lokal `5000` hanya menjadi fallback pengembangan.

### 4.2 Environment Variables Render

```text
NODE_ENV=production
HOST=0.0.0.0
FRONTEND_URL=https://<vercel-project>.vercel.app
TRUST_PROXY=1
REQUEST_BODY_LIMIT=100kb

DB_HOST=<aiven-host>
DB_PORT=<aiven-port>
DB_NAME=<aiven-database>
DB_USER=<aiven-user>
DB_PASSWORD=<aiven-password>
DB_CONNECTION_LIMIT=10
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA_BASE64=<aiven-ca-base64>

JWT_SECRET=<nilai-acak-minimal-32-karakter>
JWT_EXPIRES_IN=1d

REDIS_URL=<redis-cloud-connection-string>
REDIS_TTL_SECONDS=300

API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX=300
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=10
```

`FRONTEND_URL` harus sama persis dengan origin Vercel, tanpa path `/api`.
Beberapa origin dapat dipisahkan menggunakan koma jika diperlukan.

### 4.3 Membuat Admin Production

Jalankan perintah satu kali melalui Render Shell. Jika shell tidak tersedia,
jalankan dari terminal lokal dengan environment database production yang aman.

```bash
ADMIN_NAME="Administrator" \
ADMIN_EMAIL="admin@example.com" \
ADMIN_PASSWORD="<password-kuat>" \
npm run create:admin
```

Hapus `ADMIN_PASSWORD` setelah selesai.

### 4.4 Verifikasi Render

```text
GET https://<render-service>.onrender.com/api/health
GET https://<render-service>.onrender.com/api/health/ready
```

Endpoint readiness harus mengembalikan status MySQL siap. Redis dapat
ditampilkan sebagai `ready` atau `optional-unavailable`.

## 5. Frontend pada Vercel

### 5.1 Membuat Project

1. Import repository GitHub pada Vercel.
2. Pilih branch `main`.
3. Gunakan konfigurasi:

```text
Root Directory: frontend
Framework Preset: Vite
Install Command: npm ci
Build Command: npm run build
Output Directory: dist
```

### 5.2 Environment Variable Vercel

```text
VITE_API_URL=https://<render-service>.onrender.com/api
```

Variable Vite dibaca saat build. Setelah nilainya diubah, lakukan redeploy
frontend.

File `frontend/vercel.json` menangani SPA rewrite sehingga refresh pada route
seperti `/products` atau `/sales` tetap membuka `index.html`.

### 5.3 Sinkronisasi CORS

Setelah URL Vercel final tersedia:

1. Salin origin Vercel, misalnya `https://kasirku.vercel.app`.
2. Isi `FRONTEND_URL` pada Render dengan origin tersebut.
3. Redeploy backend Render.
4. Uji login dari frontend Vercel.

Jika menggunakan custom domain, tambahkan origin custom domain ke
`FRONTEND_URL`.

## 6. Urutan Deployment yang Disarankan

1. Siapkan Aiven MySQL dan jalankan schema.
2. Siapkan Redis Cloud.
3. Deploy backend pada Render.
4. Deploy frontend pada Vercel menggunakan URL Render.
5. Perbarui `FRONTEND_URL` Render dengan URL Vercel final.
6. Redeploy backend.
7. Buat akun admin production.
8. Jalankan verifikasi end-to-end.

## 7. Verifikasi End-to-End

1. Buka frontend Vercel.
2. Login sebagai admin, kasir, dan owner.
3. Pastikan menu dan akses sesuai role.
4. Uji CRUD kategori, supplier, produk, dan pelanggan.
5. Buat transaksi dan cetak struk.
6. Pastikan stok, riwayat, dashboard, dan chart berubah.
7. Refresh route frontend dan pastikan tidak muncul 404.
8. Pastikan request browser menuju URL Render melalui HTTPS.
9. Periksa log Render untuk koneksi Aiven dan Redis Cloud.
10. Pastikan credential tidak terlihat pada log atau response.

## 8. Troubleshooting

### CORS Ditolak

- Pastikan `FRONTEND_URL` sama dengan origin Vercel.
- Jangan tambahkan path `/api` pada `FRONTEND_URL`.
- Redeploy Render setelah mengubah environment.

### Backend Tidak Siap

- Periksa `/api/health/ready`.
- Pastikan credential Aiven benar.
- Pastikan `DB_SSL=true` dan CA base64 lengkap.
- Periksa Render logs.

### Frontend Masih Memanggil URL Lama

- Periksa `VITE_API_URL` pada Vercel.
- Redeploy karena environment Vite diterapkan saat build.

### Refresh Route Menghasilkan 404

- Pastikan `frontend/vercel.json` ikut ter-deploy.
- Pastikan Root Directory Vercel adalah `frontend`.

### Redis Tidak Terhubung

- Gunakan URI lengkap dari Redis Cloud pada `REDIS_URL`.
- Pastikan password, host, dan port tidak terpotong.
- API tetap dapat berjalan melalui MySQL selama Redis diperbaiki.

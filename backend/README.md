# KasirKu Backend

Backend REST API untuk aplikasi **KasirKu Web** dengan NodeJS Express.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Setup Database

Jalankan schema dan seed awal pada MySQL lokal:

```bash
mysql -u root -p < ../database/schema.sql
mysql -u root -p < ../database/seed.sql
```

Seed awal membuat user admin untuk kebutuhan pengujian lokal:

```text
email: admin@kasirku.test
password: Admin12345
```

## Scripts

```bash
npm run dev     # menjalankan server dengan nodemon
npm start       # menjalankan server production/local biasa
npm test        # menjalankan automated test
```

## Endpoint

```text
GET /api/health
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

Base URL local:

```text
http://localhost:5001
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

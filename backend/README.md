# KasirKu Backend

Backend REST API untuk aplikasi **KasirKu Web** dengan NodeJS Express.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Scripts

```bash
npm run dev     # menjalankan server dengan nodemon
npm start       # menjalankan server production/local biasa
npm test        # menjalankan automated test
```

## Endpoint Awal

```text
GET /api/health
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

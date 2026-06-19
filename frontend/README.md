# KasirKu Frontend

Frontend aplikasi KasirKu Web menggunakan React + Vite + TypeScript.

## Tech Stack

- React 19
- Vite 8
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix + Nova preset)
- Redux Toolkit
- React Router DOM
- Axios
- Lucide React (icons)
- React Hot Toast (notifikasi)

## Setup

```bash
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173` secara default.

## Struktur Folder

```text
src/
|-- api/               # Axios instance + API service modules
|   |-- axios.ts       # Konfigurasi Axios + interceptors
|   |-- authService.ts
|   |-- productService.ts
|   |-- categoryService.ts
|   |-- supplierService.ts
|   |-- customerService.ts
|   |-- saleService.ts
|   `-- dashboardService.ts
|-- components/
|   `-- ui/            # shadcn/ui components (17 komponen)
|-- hooks/             # Custom hooks
|-- lib/               # Utility functions
|-- assets/            # Static assets
`-- main.tsx           # Entry point
```

## API Service Modules

Setiap service module terhubung ke backend REST API melalui Axios instance dengan JWT interceptor:

| Module | Endpoint Backend | Fitur |
|---|---|---|
| `authService` | `/api/auth/*` | Login, logout, get current user |
| `productService` | `/api/products/*` | CRUD produk |
| `categoryService` | `/api/categories/*` | CRUD kategori |
| `supplierService` | `/api/suppliers/*` | CRUD supplier |
| `customerService` | `/api/customers/*` | CRUD pelanggan |
| `saleService` | `/api/sales/*` | Buat & lihat transaksi |
| `dashboardService` | `/api/dashboard/*` | Ambil ringkasan data |

## Environment Variables

Buat file `.env` di folder frontend:

```text
VITE_API_URL=http://localhost:5000/api
```

Untuk deployment terpisah, isi `VITE_API_URL` dengan URL HTTPS backend sebelum
menjalankan build. Konfigurasi fallback SPA untuk Vercel dan Netlify/Cloudflare
Pages sudah tersedia di repository.

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

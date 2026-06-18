import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import DashboardRouteLayout from "@/app/DashboardRouteLayout"
import ProtectedRoute from "@/app/ProtectedRoute"

const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"))
const CustomersPage = lazy(() => import("@/pages/CustomersPage"))
const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const ProductsPage = lazy(() => import("@/pages/ProductsPage"))
const SuppliersPage = lazy(() => import("@/pages/SuppliersPage"))

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Halaman belum diimplementasikan.</p>
    </div>
  )
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Memuat halaman...
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardRouteLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="sales" element={<Placeholder title="Riwayat Penjualan" />} />
            <Route path="sales/new" element={<Placeholder title="Transaksi Baru (POS)" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

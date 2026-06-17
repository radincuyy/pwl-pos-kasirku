import { Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import DashboardLayout from "@/components/layout/DashboardLayout"
import ProtectedRoute from "@/components/layout/ProtectedRoute"
import DashboardPage from "@/pages/DashboardPage"
import LoginPage from "@/pages/LoginPage"

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
    <Suspense>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<Placeholder title="Master Produk" />} />
            <Route path="categories" element={<Placeholder title="Master Kategori" />} />
            <Route path="suppliers" element={<Placeholder title="Data Supplier" />} />
            <Route path="customers" element={<Placeholder title="Data Pelanggan" />} />
            <Route path="sales" element={<Placeholder title="Riwayat Penjualan" />} />
            <Route path="sales/new" element={<Placeholder title="Transaksi Baru (POS)" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

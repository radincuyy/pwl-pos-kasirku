import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import DashboardRouteLayout from "@/app/DashboardRouteLayout"
import ProtectedRoute from "@/app/ProtectedRoute"

const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"))
const CustomersPage = lazy(() => import("@/pages/CustomersPage"))
const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const NewSalePage = lazy(() => import("@/pages/NewSalePage"))
const ProductsPage = lazy(() => import("@/pages/ProductsPage"))
const SalesHistoryPage = lazy(() => import("@/pages/SalesHistoryPage"))
const SuppliersPage = lazy(() => import("@/pages/SuppliersPage"))

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
            <Route path="sales" element={<SalesHistoryPage />} />
            <Route path="sales/new" element={<NewSalePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import DashboardRouteLayout from "@/app/DashboardRouteLayout"
import ProtectedRoute from "@/app/ProtectedRoute"
import RoleRoute from "@/app/RoleRoute"

const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"))
const CustomersPage = lazy(() => import("@/pages/CustomersPage"))
const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const NewSalePage = lazy(() => import("@/pages/NewSalePage"))
const ProductsPage = lazy(() => import("@/pages/ProductsPage"))
const SalesHistoryPage = lazy(() => import("@/pages/SalesHistoryPage"))
const SuppliersPage = lazy(() => import("@/pages/SuppliersPage"))

const adminAndCashier = ["admin", "kasir"] as const
const adminAndOwner = ["admin", "owner"] as const
const allRoles = ["admin", "kasir", "owner"] as const

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
            <Route
              index
              element={
                <RoleRoute allowedRoles={allRoles}>
                  <DashboardPage />
                </RoleRoute>
              }
            />
            <Route
              path="products"
              element={
                <RoleRoute allowedRoles={adminAndOwner}>
                  <ProductsPage />
                </RoleRoute>
              }
            />
            <Route
              path="categories"
              element={
                <RoleRoute allowedRoles={adminAndOwner}>
                  <CategoriesPage />
                </RoleRoute>
              }
            />
            <Route
              path="suppliers"
              element={
                <RoleRoute allowedRoles={adminAndOwner}>
                  <SuppliersPage />
                </RoleRoute>
              }
            />
            <Route
              path="customers"
              element={
                <RoleRoute allowedRoles={allRoles}>
                  <CustomersPage />
                </RoleRoute>
              }
            />
            <Route
              path="sales"
              element={
                <RoleRoute allowedRoles={allRoles}>
                  <SalesHistoryPage />
                </RoleRoute>
              }
            />
            <Route
              path="sales/new"
              element={
                <RoleRoute allowedRoles={adminAndCashier}>
                  <NewSalePage />
                </RoleRoute>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

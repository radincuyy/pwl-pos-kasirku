import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { MainLayout } from './components/common/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products/Products';
import { Categories } from './pages/Categories/Categories';
import { Suppliers } from './pages/Suppliers/Suppliers';
import { Customers } from './pages/Customers/Customers';
import { Sales } from './pages/Sales/Sales';
import { ROUTES } from './utils/constants';
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />

            {/* Protected Routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PRODUCTS}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Products />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CATEGORIES}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Categories />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.SUPPLIERS}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suppliers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CUSTOMERS}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Customers />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.SALES}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Sales />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

            {/* 404 - Not Found */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-screen bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Halaman tidak ditemukan</p>
                    <a href="/" className="text-blue-600 hover:underline">
                      Kembali ke dashboard
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Router>
      </ToastProvider>
    </Provider>
  );
}

export default App;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { ROUTES } from '../utils/constants';

export const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-sky-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-200 ring-1 ring-sky-200/20">
              KasirKu POS
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Masuk dan kelola kasirmu dengan cepat.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Sistem kasir modern untuk produk, pelanggan, pemasok, dan penjualan. Antarmuka bersih, responsif, dan siap untuk operasional sehari-hari.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fitur</p>
                <p className="mt-3 text-base text-slate-200">Kelola inventaris, transaksi, dan laporan tanpa ribet.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Keamanan</p>
                <p className="mt-3 text-base text-slate-200">Login aman dengan sesi terproteksi dan kontrol akses penuh.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Selamat datang kembali</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Akses ke dashboard admin</h2>
              <p className="mt-3 text-sm text-slate-400">Masukkan kredensial Anda untuk memulai sesi dan melihat laporan operasional.</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

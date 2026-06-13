import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD },
    { name: 'Produk', path: ROUTES.PRODUCTS },
    { name: 'Kategori', path: ROUTES.CATEGORIES },
    { name: 'Supplier', path: ROUTES.SUPPLIERS },
    { name: 'Pelanggan', path: ROUTES.CUSTOMERS },
    { name: 'Penjualan', path: ROUTES.SALES },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-72 flex-col border-r border-slate-200/10 bg-slate-950 px-6 py-8 text-white lg:flex">
      <div className="mb-10">
        <div className="inline-flex items-center rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400 shadow-inner shadow-white/5">
          KasirKu Pro
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">Panel Utama</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block rounded-3xl px-5 py-3 text-sm font-semibold transition ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-900/95 p-5 ring-1 ring-white/10 shadow-inner shadow-white/5">
        <h3 className="text-xs uppercase tracking-[0.32em] text-slate-500">Tip</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Gunakan menu samping untuk berpindah ke laporan dan pengelolaan data.
        </p>
      </div>
    </aside>
  );
};

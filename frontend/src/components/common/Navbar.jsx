import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-lg font-bold shadow-lg shadow-sky-500/20">
            K
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">KasirKu</h1>
            <p className="text-sm text-slate-500">Dashboard operasi kasir</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 shadow-sm">
              <span>{user.name}</span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
                {user.role}
              </span>
            </div>
          )}
          <button
            onClick={logout}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

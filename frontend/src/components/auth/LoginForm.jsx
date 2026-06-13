import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { getErrorMessage } from '../../utils/helpers';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ROUTES } from '../../utils/constants';

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setFormError('');
  };

  useEffect(() => {
    if (user) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!credentials.email || !credentials.password) {
      setFormError('Email dan password harus diisi');
      return;
    }

    try {
      await dispatch(login(credentials)).unwrap();
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Akses Cepat</p>
        <h2 className="text-3xl font-semibold text-white">Masuk ke KasirKu</h2>
        <p className="text-sm text-slate-400">Kelola produk, pemasok, pelanggan, dan penjualan dengan mudah.</p>
      </div>

      {(formError || error) && (
        <div className="rounded-3xl border border-red-500/20 bg-red-50/90 px-4 py-3 text-sm text-red-700">
          {formError || error}
        </div>
      )}

      <div className="grid gap-4">
        <Input
          id="email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="admin@kasirku.test"
        />

        <Input
          id="password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Memeriksa...' : 'Masuk Sekarang'}
      </Button>
    </form>
  );
};

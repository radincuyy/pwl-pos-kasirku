import { useEffect, useState } from 'react';
import api from '../services/api';
import { getErrorMessage } from '../utils/helpers';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/summary');
        setSummary(response.data.data);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 rounded-3xl bg-white/80 shadow-sm">
        <p className="text-slate-500">Memuat ringkasan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Ringkasan performa toko dan stok terbaru.</p>
        </div>
        <div className="rounded-3xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/80">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Update Hari Ini</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Data terbaru otomatis ditarik dari server</p>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white shadow-xl shadow-sky-500/20">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-100/80">Total Produk</p>
            <p className="mt-4 text-4xl font-semibold">{summary.totalProducts || 0}</p>
            <p className="mt-3 text-sm text-sky-100/80">Produk yang tersedia di inventaris</p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Transaksi</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.totalTransactions || 0}</p>
            <p className="mt-3 text-sm text-slate-500">Semua transaksi hari ini dan sebelumnya.</p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Pendapatan</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              Rp {(summary.totalRevenue || 0).toLocaleString('id-ID')}
            </p>
            <p className="mt-3 text-sm text-slate-500">Pendapatan bersih selama periode.</p>
          </div>

          <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Stok Rendah</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.lowStockProducts || 0}</p>
            <p className="mt-3 text-sm text-slate-500">Produk yang perlu diisi ulang segera.</p>
          </div>
        </div>
      )}
    </div>
  );
};

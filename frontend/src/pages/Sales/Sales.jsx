import { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingCart, DollarSign, CalendarDays } from 'lucide-react';
import api from '../../services/api';
import { getErrorMessage } from '../../utils/helpers';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';

export const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await api.get('/sales');
        setSales(response.data.data || []);
        setError(null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filteredSales = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return sales;
    return sales.filter((sale) => {
      const invoice = sale.invoice_number?.toString().toLowerCase() ?? '';
      const customer = sale.customer_name?.toLowerCase() ?? '';
      return invoice.includes(lowerQuery) || customer.includes(lowerQuery);
    });
  }, [sales, query]);

  const summary = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);
    const totalTransactions = sales.length;
    const latestSale = sales[0] || null;
    return { totalRevenue, totalTransactions, latestSale };
  }, [sales]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Penjualan</h1>
          <p className="mt-2 text-sm text-slate-500">Lihat ringkasan transaksi dan detail penjualan terakhir.</p>
        </div>
        <div className="flex w-full max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Input
              id="sales-search"
              name="sales-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari invoice atau pelanggan..."
              className="pr-10"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <Button type="button" onClick={() => setQuery('')} variant="secondary">
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-white/10 p-3">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sky-100/80">Transaksi</p>
              <p className="mt-3 text-3xl font-semibold">{summary.totalTransactions}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-slate-100 p-3 text-slate-700">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pendapatan</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">Rp {summary.totalRevenue.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-white">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-slate-100 p-3 text-slate-700">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Transaksi terbaru</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.latestSale ? summary.latestSale.invoice_number || summary.latestSale.id : '-'}</p>
            </div>
          </div>
        </Card>
      </div>

      {loading ? (
        <Card className="bg-white">
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </Card>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700 shadow-sm">
          {error}
        </div>
      ) : filteredSales.length === 0 ? (
        <EmptyState
          title="Tidak ada transaksi"
          description="Coba lagi nanti atau periksa filter pencarian Anda."
          action={<Button type="button" onClick={() => setQuery('')}>Tampilkan semua</Button>}
        />
      ) : (
        <Card className="bg-white">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Riwayat Transaksi</h2>
              <p className="mt-1 text-sm text-slate-500">Lihat detail transaksi terbaru dan jumlah penjualan.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.16em] text-slate-500">Invoice</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.16em] text-slate-500">Pelanggan</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.16em] text-slate-500">Total</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.16em] text-slate-500">Tanggal</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.16em] text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id ?? sale.invoice_number ?? JSON.stringify(sale)} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">{sale.invoice_number || sale.id || '-'}</td>
                      <td className="px-4 py-4 text-slate-700">{sale.customer_name || 'Umum'}</td>
                      <td className="px-4 py-4 text-slate-700">Rp {Number(sale.total_amount || 0).toLocaleString('id-ID')}</td>
                      <td className="px-4 py-4 text-slate-700">{sale.created_at ? new Date(sale.created_at).toLocaleString('id-ID') : '-'}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

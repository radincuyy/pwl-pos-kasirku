"use client"

import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDashboardSummary } from "@/store/dashboardSlice";
import { useEffect } from "react";

function formatCurrency(v: number) {
  return v.toLocaleString(undefined, { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { summary, loading, error } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // log full error for debugging while showing a friendly message to the user
      console.error("Dashboard summary error:", error);
    }
  }, [error]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Ringkasan performa toko Anda</p>
          </div>

          <div className="flex items-center gap-3">
            <a href="/sales/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:brightness-105">+ New Sale</a>
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">Export</button>
          </div>
        </div>

        {loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-28 rounded-lg bg-muted animate-pulse" />
              <div className="h-28 rounded-lg bg-muted animate-pulse" />
              <div className="h-28 rounded-lg bg-muted animate-pulse" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-56 rounded-lg bg-muted animate-pulse" />
              <div className="h-56 rounded-lg bg-muted animate-pulse" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-destructive">Terjadi kesalahan</div>
                <div className="text-sm text-destructive/80">Terjadi kesalahan saat memuat data. Silakan coba lagi atau hubungi administrator.</div>
              </div>
              <div>
                <button
                  onClick={() => dispatch(fetchDashboardSummary())}
                  className="ml-4 rounded-md bg-destructive/90 px-3 py-1 text-sm text-destructive-foreground"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {summary && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border shadow-sm flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="size-6 text-primary" viewBox="0 0 24 24" fill="none"><path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Produk</div>
                  <div className="text-2xl font-bold">{summary.totalProducts}</div>
                  <div className="text-xs text-muted-foreground">Updated just now</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border shadow-sm flex items-center gap-4">
                <div className="rounded-full bg-emerald-50 p-3">
                  <svg className="size-6 text-emerald-500" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Penjualan</div>
                  <div className="text-2xl font-bold">{summary.totalSales}</div>
                  <div className="text-xs text-muted-foreground">Last 24 hours</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border shadow-sm flex items-center gap-4">
                <div className="rounded-full bg-yellow-50 p-3">
                  <svg className="size-6 text-yellow-500" viewBox="0 0 24 24" fill="none"><path d="M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pendapatan Hari Ini</div>
                  <div className="text-2xl font-bold">{formatCurrency(summary.revenueToday)}</div>
                  <div className="text-xs text-muted-foreground">Compared to yesterday</div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <section className="p-4 rounded-xl border bg-card shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Produk Stok Rendah</h3>
                  <a href="/products" className="text-sm text-muted-foreground">Lihat semua</a>
                </div>

                {summary.lowStockProducts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Tidak ada produk stok rendah.</div>
                ) : (
                  <ul className="space-y-3">
                    {summary.lowStockProducts.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium">{p.name} <span className="text-xs text-muted-foreground">({p.sku})</span></div>
                          <div className="text-xs text-muted-foreground">Kategori: {p.categoryName}</div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className={`px-2 py-1 rounded-full text-xs ${p.stock <= p.minimumStock ? 'bg-destructive/10 text-destructive' : 'bg-emerald-50 text-emerald-600'}`}>
                            Stok: {p.stock}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Min: {p.minimumStock}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="p-4 rounded-xl border bg-card shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Penjualan Terbaru</h3>
                  <a href="/sales" className="text-sm text-muted-foreground">Lihat semua</a>
                </div>

                {summary.recentSales.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Belum ada penjualan.</div>
                ) : (
                  <div className="divide-y">
                    {summary.recentSales.map((s) => (
                      <div key={s.id} className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium">{s.invoiceNumber} — {s.cashierName}</div>
                          <div className="text-xs text-muted-foreground">{s.customerName ?? "Umum"} • {new Date(s.saleDate).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(s.totalAmount)}</div>
                          <div className="text-xs text-muted-foreground">{s.paymentMethod} • {s.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client"

import { useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { AlertTriangleIcon, BoxIcon, ReceiptTextIcon, RefreshCwIcon, ShoppingCartIcon, WalletIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchDashboardSummary } from "@/store/dashboardSlice"

type SummaryCardProps = {
  title: string
  value: string
  description: string
  icon: ReactNode
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function SummaryCard({ title, value, description, icon }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-2xl font-semibold tabular-nums">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-lg border bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { summary, loading, error } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardSummary())
  }, [dispatch])

  if (loading && !summary) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
          <div className="h-32 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  if (error && !summary) {
    return (
      <div className="p-4 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangleIcon className="size-5" />
              Terjadi kesalahan
            </CardTitle>
            <CardDescription>
              Ringkasan dashboard gagal dimuat. Coba lagi atau periksa koneksi API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => dispatch(fetchDashboardSummary())}>
              <RefreshCwIcon className="size-4" />
              Coba lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Ringkasan aktivitas penjualan dan stok toko.
          </p>
        </div>
        <Button asChild>
          <Link to="/sales/new">
            <ShoppingCartIcon className="size-4" />
            Transaksi baru
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total produk"
          value={summary.totalProducts.toString()}
          description="Produk aktif yang tercatat di sistem."
          icon={<BoxIcon className="size-5" />}
        />
        <SummaryCard
          title="Total penjualan"
          value={summary.totalSales.toString()}
          description="Jumlah transaksi yang sudah tersimpan."
          icon={<ReceiptTextIcon className="size-5" />}
        />
        <SummaryCard
          title="Pendapatan hari ini"
          value={formatCurrency(summary.revenueToday)}
          description="Akumulasi penjualan pada tanggal berjalan."
          icon={<WalletIcon className="size-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Produk stok rendah</CardTitle>
              <CardDescription>Produk yang perlu segera diperiksa.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/products">Lihat produk</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {summary.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada produk dengan stok rendah.
              </p>
            ) : (
              <div className="divide-y">
                {summary.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sku} | {product.categoryName}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {product.stock}/{product.minimumStock}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Penjualan terbaru</CardTitle>
              <CardDescription>Transaksi terakhir yang masuk.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/sales">Lihat riwayat</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {summary.recentSales.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada transaksi penjualan.
              </p>
            ) : (
              <div className="divide-y">
                {summary.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{sale.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.customerName ?? "Umum"} | {sale.cashierName} | {formatDateTime(sale.saleDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(sale.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.paymentMethod} | {sale.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

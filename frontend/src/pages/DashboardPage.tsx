"use client"

import { useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangleIcon,
  BoxIcon,
  PackageCheckIcon,
  ReceiptTextIcon,
  RefreshCwIcon,
  ShoppingCartIcon,
  WalletIcon,
} from "lucide-react"
import type { CashierDashboardSummary } from "@/api/dashboardService"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/ui/card"
import { SalesTrendChart } from "@/components/organisms/dashboard/SalesTrendChart"
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethod,
} from "@/lib/format"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchCashierDashboardSummary,
  fetchDashboardSummary,
} from "@/store/dashboardSlice"

type SummaryCardProps = {
  title: string
  value: string
  description: string
  icon: ReactNode
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

function CashierDashboard({
  summary,
  cashierName,
}: {
  summary: CashierDashboardSummary
  cashierName: string
}) {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Halo, {cashierName}</h2>
          <p className="text-sm text-muted-foreground">
            Ringkasan transaksi yang kamu tangani hari ini.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/sales/new">
            <ShoppingCartIcon />
            Transaksi baru
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Transaksi hari ini"
          value={summary.totalSalesToday.toString()}
          description="Transaksi lunas yang kamu proses."
          icon={<ReceiptTextIcon className="size-5" />}
        />
        <SummaryCard
          title="Penjualan hari ini"
          value={formatCurrency(summary.revenueToday)}
          description="Total nilai transaksi yang kamu tangani."
          icon={<WalletIcon className="size-5" />}
        />
        <SummaryCard
          title="Item terjual"
          value={summary.itemsSoldToday.toString()}
          description="Jumlah barang terjual dari transaksimu."
          icon={<PackageCheckIcon className="size-5" />}
        />
      </div>

      <SalesTrendChart
        data={summary.salesTrend}
        description="Pendapatan dan jumlah transaksi yang kamu proses"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Transaksi terakhir</CardTitle>
            <CardDescription>Penjualan terbaru yang kamu proses.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/sales">Lihat riwayat</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {summary.recentSales.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
              <ReceiptTextIcon className="size-8 text-muted-foreground" />
              <div>
                <p className="font-medium">Belum ada transaksi</p>
                <p className="text-sm text-muted-foreground">
                  Transaksi yang kamu buat akan muncul di sini.
                </p>
              </div>
              <Button asChild>
                <Link to="/sales/new">Mulai transaksi</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {summary.recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{sale.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {sale.customerName ?? "Umum"} | {formatDateTime(sale.saleDate)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <Badge variant="secondary">
                      {formatPaymentMethod(sale.paymentMethod)}
                    </Badge>
                    <p className="font-medium tabular-nums">
                      {formatCurrency(sale.totalAmount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { summary, cashierSummary, loading, error } = useAppSelector(
    (state) => state.dashboard
  )
  const user = useAppSelector((state) => state.auth.user)
  const role = user?.role
  const isCashier = role === "kasir"
  const canViewProducts = role === "admin" || role === "owner"
  const canCreateSales = role === "admin"
  const activeSummary = isCashier ? cashierSummary : summary

  useEffect(() => {
    if (role === "kasir") {
      dispatch(fetchCashierDashboardSummary())
      return
    }

    if (role === "admin" || role === "owner") {
      dispatch(fetchDashboardSummary())
    }
  }, [dispatch, role])

  const handleRetry = (): void => {
    if (isCashier) {
      void dispatch(fetchCashierDashboardSummary())
      return
    }

    void dispatch(fetchDashboardSummary())
  }

  if (loading && !activeSummary) {
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

  if (error && !activeSummary) {
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
            <Button onClick={handleRetry}>
              <RefreshCwIcon className="size-4" />
              Coba lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!activeSummary || !user) {
    return null
  }

  if (isCashier && cashierSummary) {
    return (
      <CashierDashboard
        summary={cashierSummary}
        cashierName={user.name}
      />
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
        {canCreateSales && (
          <Button asChild>
            <Link to="/sales/new">
              <ShoppingCartIcon className="size-4" />
              Transaksi baru
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total produk"
          value={summary.totalProducts.toString()}
          description="Produk aktif yang tercatat di sistem."
          icon={<BoxIcon className="size-5" />}
        />
        <SummaryCard
          title="Transaksi hari ini"
          value={summary.totalSalesToday.toString()}
          description="Transaksi lunas pada tanggal berjalan."
          icon={<ReceiptTextIcon className="size-5" />}
        />
        <SummaryCard
          title="Pendapatan hari ini"
          value={formatCurrency(summary.revenueToday)}
          description="Akumulasi penjualan pada tanggal berjalan."
          icon={<WalletIcon className="size-5" />}
        />
        <SummaryCard
          title="Total pendapatan"
          value={formatCurrency(summary.totalRevenue)}
          description="Akumulasi seluruh transaksi yang sudah lunas."
          icon={<WalletIcon className="size-5" />}
        />
      </div>

      <SalesTrendChart
        data={summary.salesTrend}
        description="Pendapatan dan jumlah transaksi seluruh toko"
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Produk stok rendah</CardTitle>
              <CardDescription>Produk yang perlu segera diperiksa.</CardDescription>
            </div>
            {canViewProducts && (
              <Button asChild variant="outline" size="sm">
                <Link to="/products">Lihat produk</Link>
              </Button>
            )}
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

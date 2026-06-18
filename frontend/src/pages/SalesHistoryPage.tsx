import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/atoms/ui/button"
import { Input } from "@/components/atoms/ui/input"
import { SaleDetailDialog } from "@/components/organisms/sales/SaleDetailDialog"
import { SalesHistoryTable } from "@/components/organisms/sales/SalesHistoryTable"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  clearCurrentSale,
  clearSaleError,
  fetchSaleById,
  fetchSales,
} from "@/store/saleSlice"

export default function SalesHistoryPage() {
  const dispatch = useAppDispatch()
  const { sales, currentSale, loading, error } = useAppSelector(
    (state) => state.sales
  )
  const role = useAppSelector((state) => state.auth.user?.role)
  const canCreateSales = role === "admin" || role === "kasir"
  const [search, setSearch] = useState("")
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    dispatch(clearCurrentSale())
    dispatch(clearSaleError())
    dispatch(fetchSales())
  }, [dispatch])

  const filteredSales = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return sales
    }

    return sales.filter((sale) =>
      [
        sale.invoiceNumber,
        sale.customerName ?? "umum",
        sale.cashierName,
        sale.paymentMethod,
      ].some((value) => value.toLowerCase().includes(keyword))
    )
  }, [sales, search])

  const handleViewDetail = async (saleId: number): Promise<void> => {
    dispatch(clearCurrentSale())
    setDetailOpen(true)

    try {
      await dispatch(fetchSaleById(saleId)).unwrap()
    } catch {
      setDetailOpen(false)
    }
  }

  const handleDetailOpenChange = (open: boolean): void => {
    setDetailOpen(open)

    if (!open) {
      dispatch(clearCurrentSale())
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Riwayat penjualan</h2>
          <p className="text-sm text-muted-foreground">
            Telusuri transaksi dan periksa detail invoice.
          </p>
        </div>
        {canCreateSales && (
          <Button asChild>
            <Link to="/sales/new">
              <PlusIcon />
              Transaksi baru
            </Link>
          </Button>
        )}
      </div>

      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari invoice, pelanggan, atau kasir..."
          className="pl-8"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <SalesHistoryTable
        sales={filteredSales}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      <SaleDetailDialog
        open={detailOpen}
        loading={loading}
        sale={currentSale}
        onOpenChange={handleDetailOpenChange}
      />
    </div>
  )
}

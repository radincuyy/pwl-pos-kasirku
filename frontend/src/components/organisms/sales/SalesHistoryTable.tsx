import { EyeIcon, ReceiptTextIcon } from "lucide-react"

import type { SaleSummary } from "@/api/saleService"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/ui/table"
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethod,
} from "@/lib/format"

type SalesHistoryTableProps = {
  sales: SaleSummary[]
  loading: boolean
  onViewDetail: (saleId: number) => void
}

export function SalesHistoryTable({
  sales,
  loading,
  onViewDetail,
}: SalesHistoryTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Kasir</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="w-20 text-right">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && sales.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-28 text-center text-muted-foreground"
              >
                Memuat riwayat penjualan...
              </TableCell>
            </TableRow>
          ) : sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ReceiptTextIcon className="size-7" />
                  <span>Belum ada transaksi yang cocok.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  {sale.invoiceNumber}
                </TableCell>
                <TableCell>{sale.customerName ?? "Umum"}</TableCell>
                <TableCell>{sale.cashierName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {formatPaymentMethod(sale.paymentMethod)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatCurrency(sale.totalAmount)}
                </TableCell>
                <TableCell>{formatDateTime(sale.saleDate)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={`Lihat ${sale.invoiceNumber}`}
                    onClick={() => onViewDetail(sale.id)}
                  >
                    <EyeIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

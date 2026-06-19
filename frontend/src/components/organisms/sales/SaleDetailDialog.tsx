import { PrinterIcon } from "lucide-react"

import type { SaleDetail } from "@/api/saleService"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/ui/dialog"
import { Separator } from "@/components/atoms/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/ui/table"
import { PrintableReceipt } from "@/components/molecules/sales/PrintableReceipt"
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethod,
} from "@/lib/format"
import { printReceipt } from "@/lib/printReceipt"

type SaleDetailDialogProps = {
  open: boolean
  loading: boolean
  sale: SaleDetail | null
  onOpenChange: (open: boolean) => void
}

export function SaleDetailDialog({
  open,
  loading,
  sale,
  onOpenChange,
}: SaleDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail penjualan</DialogTitle>
          <DialogDescription>
            Rincian produk dan pembayaran pada transaksi.
          </DialogDescription>
        </DialogHeader>

        {loading && !sale ? (
          <div className="py-12 text-center text-muted-foreground">
            Memuat detail transaksi...
          </div>
        ) : sale ? (
          <div className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Nomor invoice</p>
                <p className="font-medium">{sale.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tanggal</p>
                <p className="font-medium">{formatDateTime(sale.saleDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pelanggan</p>
                <p className="font-medium">{sale.customerName ?? "Umum"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kasir</p>
                <p className="font-medium">{sale.cashierName}</p>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.productSku}
                        </p>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <Badge variant="secondary">
                  {formatPaymentMethod(sale.paymentMethod)}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total</span>
                <strong>{formatCurrency(sale.totalAmount)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibayar</span>
                <span>{formatCurrency(sale.paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kembalian</span>
                <span>{formatCurrency(sale.changeAmount)}</span>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={printReceipt} disabled={!sale}>
            <PrinterIcon />
            Cetak struk
          </Button>
        </DialogFooter>
      </DialogContent>

      {sale && <PrintableReceipt sale={sale} />}
    </Dialog>
  )
}

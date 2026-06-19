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
import { PrintableReceipt } from "@/components/molecules/sales/PrintableReceipt"
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethod,
} from "@/lib/format"
import { printReceipt } from "@/lib/printReceipt"

type SaleReceiptDialogProps = {
  open: boolean
  sale: SaleDetail | null
  onOpenChange: (open: boolean) => void
  onViewHistory: () => void
}

export function SaleReceiptDialog({
  open,
  sale,
  onOpenChange,
  onViewHistory,
}: SaleReceiptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transaksi berhasil</DialogTitle>
          <DialogDescription>
            Penjualan sudah tersimpan dan stok produk telah diperbarui.
          </DialogDescription>
        </DialogHeader>

        {sale && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{sale.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(sale.saleDate)}
                </p>
              </div>
              <Badge variant="secondary">Lunas</Badge>
            </div>

            <div className="max-h-52 divide-y overflow-y-auto rounded-lg border px-3">
              {sale.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pelanggan</span>
                <span>{sale.customerName ?? "Umum"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pembayaran</span>
                <span>{formatPaymentMethod(sale.paymentMethod)}</span>
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
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Transaksi baru
          </Button>
          <Button variant="outline" onClick={printReceipt} disabled={!sale}>
            <PrinterIcon />
            Cetak struk
          </Button>
          <Button onClick={onViewHistory}>Lihat riwayat</Button>
        </DialogFooter>
      </DialogContent>

      {sale && <PrintableReceipt sale={sale} />}
    </Dialog>
  )
}

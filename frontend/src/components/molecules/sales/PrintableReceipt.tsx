import { createPortal } from "react-dom"

import type { SaleDetail } from "@/api/saleService"
import {
  formatCurrency,
  formatDateTime,
  formatPaymentMethod,
} from "@/lib/format"

type PrintableReceiptProps = {
  sale: SaleDetail
}

export function PrintableReceipt({ sale }: PrintableReceiptProps) {
  return createPortal(
    <section className="receipt-print-root" aria-hidden="true">
      <header className="receipt-print-header">
        <p className="receipt-print-brand">KasirKu</p>
        <p>Struk penjualan</p>
      </header>

      <div className="receipt-print-meta">
        <div>
          <span>Invoice</span>
          <strong>{sale.invoiceNumber}</strong>
        </div>
        <div>
          <span>Tanggal</span>
          <span>{formatDateTime(sale.saleDate)}</span>
        </div>
        <div>
          <span>Kasir</span>
          <span>{sale.cashierName}</span>
        </div>
        <div>
          <span>Pelanggan</span>
          <span>{sale.customerName ?? "Umum"}</span>
        </div>
      </div>

      <div className="receipt-print-items">
        {sale.items.map((item) => (
          <div className="receipt-print-item" key={item.id}>
            <p>{item.productName}</p>
            <div>
              <span>
                {item.quantity} x {formatCurrency(item.price)}
              </span>
              <strong>{formatCurrency(item.subtotal)}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="receipt-print-totals">
        <div>
          <span>Metode</span>
          <span>{formatPaymentMethod(sale.paymentMethod)}</span>
        </div>
        <div className="receipt-print-total">
          <span>Total</span>
          <strong>{formatCurrency(sale.totalAmount)}</strong>
        </div>
        <div>
          <span>Dibayar</span>
          <span>{formatCurrency(sale.paidAmount)}</span>
        </div>
        <div>
          <span>Kembalian</span>
          <span>{formatCurrency(sale.changeAmount)}</span>
        </div>
      </div>

      <footer className="receipt-print-footer">
        <p>Terima kasih telah berbelanja.</p>
        <p>Barang yang sudah dibeli tidak dapat dikembalikan.</p>
      </footer>
    </section>,
    document.body
  )
}

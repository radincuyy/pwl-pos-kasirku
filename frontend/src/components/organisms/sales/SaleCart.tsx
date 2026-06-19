import {
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  Trash2Icon,
} from "lucide-react"

import type { Customer } from "@/api/customerService"
import type { Product } from "@/api/productService"
import { Button } from "@/components/atoms/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/atoms/ui/card"
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select"
import { Separator } from "@/components/atoms/ui/separator"
import { formatCurrency } from "@/lib/format"

export type PaymentMethod = "cash" | "transfer" | "qris" | "debit"

export type SaleCartItem = {
  product: Product
  quantity: number
}

type SaleCartProps = {
  cart: SaleCartItem[]
  customers: Customer[]
  selectedCustomerId: number | null
  paymentMethod: PaymentMethod
  paidAmount: number
  totalAmount: number
  changeAmount: number
  loading: boolean
  error: string | null
  onCheckout: () => void
  onClearCart: () => void
  onCustomerChange: (customerId: number | null) => void
  onPaidAmountChange: (amount: number) => void
  onPaymentMethodChange: (method: PaymentMethod) => void
  onRemoveItem: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
}

export function SaleCart({
  cart,
  customers,
  selectedCustomerId,
  paymentMethod,
  paidAmount,
  totalAmount,
  changeAmount,
  loading,
  error,
  onCheckout,
  onClearCart,
  onCustomerChange,
  onPaidAmountChange,
  onPaymentMethodChange,
  onRemoveItem,
  onUpdateQuantity,
}: SaleCartProps) {
  const canCheckout =
    cart.length > 0 && paidAmount >= totalAmount && !loading

  return (
    <Card className="max-h-[calc(100svh-7rem)]">
      <CardHeader className="border-b">
        <div>
          <CardTitle>Keranjang</CardTitle>
          <CardDescription>{cart.length} jenis produk dipilih</CardDescription>
        </div>
        {cart.length > 0 && (
          <CardAction>
            <Button variant="ghost" size="sm" onClick={onClearCart}>
              Kosongkan
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="min-h-40 flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
            <ShoppingCartIcon className="size-8 text-muted-foreground" />
            <p className="font-medium">Keranjang masih kosong</p>
            <p className="text-sm text-muted-foreground">
              Pilih produk untuk memulai transaksi.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {cart.map((item) => (
              <div key={item.product.id} className="space-y-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(item.product.sellingPrice)} per item
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    title={`Hapus ${item.product.name}`}
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      title="Kurangi jumlah"
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <MinusIcon />
                    </Button>
                    <span className="w-9 text-center font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      title="Tambah jumlah"
                      disabled={item.quantity >= item.product.stock}
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                  <p className="font-medium tabular-nums">
                    {formatCurrency(item.product.sellingPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="block space-y-4">
        <div className="grid gap-2">
          <Label>Pelanggan (opsional)</Label>
          <Select
            value={selectedCustomerId?.toString() ?? "general"}
            onValueChange={(value) =>
              onCustomerChange(value === "general" ? null : Number(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih pelanggan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Pelanggan umum</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id.toString()}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Biarkan pelanggan umum untuk transaksi retail biasa.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end gap-3">
          <div className="grid min-w-0 gap-2">
            <Label className="min-h-5">Metode pembayaran</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                onPaymentMethodChange(value as PaymentMethod)
              }
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="start"
                side="bottom"
                sideOffset={4}
                className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]"
              >
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="qris">QRIS</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="paid-amount" className="min-h-5">
              Nominal bayar
            </Label>
            <Input
              id="paid-amount"
              type="number"
              min="0"
              value={paidAmount || ""}
              className="h-9 w-full"
              onChange={(event) => {
                const amount = Number(event.target.value)
                onPaidAmountChange(Number.isFinite(amount) ? amount : 0)
              }}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={cart.length === 0}
          onClick={() => onPaidAmountChange(totalAmount)}
        >
          Gunakan nominal pas
        </Button>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total</span>
            <strong className="text-base tabular-nums">
              {formatCurrency(totalAmount)}
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Kembalian</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(changeAmount)}
            </span>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {!error && cart.length > 0 && paidAmount < totalAmount && (
          <p className="text-sm text-muted-foreground">
            Nominal bayar kurang {formatCurrency(totalAmount - paidAmount)}.
          </p>
        )}

        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!canCheckout}
          onClick={onCheckout}
        >
          {loading ? "Memproses..." : "Selesaikan transaksi"}
        </Button>
      </CardFooter>
    </Card>
  )
}

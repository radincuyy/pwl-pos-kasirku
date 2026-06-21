import { ShoppingCartIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/atoms/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/ui/sheet"
import { formatCurrency } from "@/lib/format"

type MobileSaleCartProps = {
  open: boolean
  itemCount: number
  totalAmount: number
  children: ReactNode
  onOpenChange: (open: boolean) => void
}

export function MobileSaleCart({
  open,
  itemCount,
  totalAmount,
  children,
  onOpenChange,
}: MobileSaleCartProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 h-14 justify-between px-4 shadow-md md:left-auto md:w-[calc(100vw-var(--sidebar-width)-2rem)] lg:hidden"
        >
          <span className="flex items-center gap-2">
            <ShoppingCartIcon className="size-5" />
            <span>Keranjang · {itemCount} item</span>
          </span>
          <strong className="tabular-nums">{formatCurrency(totalAmount)}</strong>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[88dvh] max-h-[88svh] gap-0 overflow-y-auto overscroll-contain rounded-t-xl p-0 [-webkit-overflow-scrolling:touch] lg:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Keranjang transaksi</SheetTitle>
          <SheetDescription>
            Atur produk, pelanggan, dan pembayaran transaksi.
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}

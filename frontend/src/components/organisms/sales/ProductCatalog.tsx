import { PackageOpenIcon, PlusIcon, SearchIcon } from "lucide-react"

import type { Product } from "@/api/productService"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/ui/card"
import { Input } from "@/components/atoms/ui/input"
import { ProductThumbnail } from "@/components/molecules/products/ProductThumbnail"
import { formatCurrency } from "@/lib/format"

type ProductCatalogProps = {
  products: Product[]
  cartQuantities: Record<number, number>
  loading: boolean
  searchValue: string
  onAddProduct: (product: Product) => void
  onSearchChange: (value: string) => void
}

export function ProductCatalog({
  products,
  cartQuantities,
  loading,
  searchValue,
  onAddProduct,
  onSearchChange,
}: ProductCatalogProps) {
  const keyword = searchValue.trim().toLowerCase()
  const filteredProducts = keyword
    ? products.filter((product) =>
        [product.name, product.sku, product.category.name].some((value) =>
          value.toLowerCase().includes(keyword)
        )
      )
    : products

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama, SKU, atau kategori..."
          className="pl-8"
        />
      </div>

      {loading && products.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
          <PackageOpenIcon className="size-8 text-muted-foreground" />
          <p className="font-medium">Produk tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba kata kunci lain atau periksa data produk.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const cartQuantity = cartQuantities[product.id] ?? 0
            const availableStock = product.stock - cartQuantity
            const outOfStock = availableStock <= 0

            return (
              <Card key={product.id} size="sm" className="gap-0 py-0">
                <ProductThumbnail
                  src={product.imageUrl}
                  alt={`Gambar ${product.name}`}
                  size="catalog"
                />
                <CardHeader className="pt-3">
                  <div className="min-w-0">
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {product.sku} · {product.category.name}
                    </CardDescription>
                  </div>
                  <CardAction>
                    <Badge variant={outOfStock ? "destructive" : "secondary"}>
                      Stok {availableStock}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="mt-auto flex items-end justify-between gap-3 py-3">
                  <p className="font-semibold tabular-nums">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                  <Button
                    size="icon"
                    title={`Tambah ${product.name}`}
                    disabled={outOfStock}
                    onClick={() => onAddProduct(product)}
                  >
                    <PlusIcon />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { PackageOpenIcon, PlusIcon, SearchIcon } from "lucide-react"

import type { Product } from "@/api/productService"
import { Badge } from "@/components/atoms/ui/badge"
import { Button } from "@/components/atoms/ui/button"
import {
  Card,
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
    <div className="@container/catalog flex flex-col gap-4">
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
        <div className="grid grid-cols-2 gap-2 @2xl/catalog:grid-cols-3 @5xl/catalog:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="h-60 animate-pulse rounded-xl bg-muted" />
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
        <div className="grid grid-cols-2 gap-2 @2xl/catalog:grid-cols-3 @5xl/catalog:grid-cols-4">
          {filteredProducts.map((product) => {
            const cartQuantity = cartQuantities[product.id] ?? 0
            const availableStock = product.stock - cartQuantity
            const outOfStock = availableStock <= 0

            return (
              <Card
                key={product.id}
                size="sm"
                className="gap-0 py-0 [--card-spacing:--spacing(2)] sm:[--card-spacing:--spacing(3)]"
              >
                <div className="relative bg-muted">
                  <ProductThumbnail
                    src={product.imageUrl}
                    alt={`Gambar ${product.name}`}
                    size="catalog"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={outOfStock ? "destructive" : "secondary"}>
                      Stok {availableStock}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pt-2 sm:pt-3">
                  <CardTitle className="line-clamp-2 min-h-10">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="mt-0.5 truncate text-xs">
                    {product.sku} · {product.category.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between gap-1.5 py-2 sm:gap-3 sm:py-3">
                  <p className="min-w-0 text-[0.8rem] font-semibold tabular-nums sm:text-sm">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                  <Button
                    size="icon"
                    className="size-11"
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

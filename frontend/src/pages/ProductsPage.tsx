import { useEffect, useMemo, useState, type FormEvent } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import type { Product, ProductPayload } from "@/api/productService"
import { DeleteConfirmDialog } from "@/components/molecules/DeleteConfirmDialog"
import { ProductThumbnail } from "@/components/molecules/products/ProductThumbnail"
import { ManagementPageLayout } from "@/components/templates/ManagementPageLayout"
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
import { Input } from "@/components/atoms/ui/input"
import { Label } from "@/components/atoms/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/ui/table"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchCategories } from "@/store/categorySlice"
import {
  clearProductError,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/store/productSlice"
import { fetchSuppliers } from "@/store/supplierSlice"

type ProductForm = {
  categoryId: string
  supplierId: string
  sku: string
  name: string
  imageUrl: string
  purchasePrice: string
  sellingPrice: string
  stock: string
  minimumStock: string
}

const emptyForm: ProductForm = {
  categoryId: "",
  supplierId: "",
  sku: "",
  name: "",
  imageUrl: "",
  purchasePrice: "0",
  sellingPrice: "0",
  stock: "0",
  minimumStock: "0",
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

function toProductForm(product: Product): ProductForm {
  return {
    categoryId: product.categoryId.toString(),
    supplierId: product.supplierId.toString(),
    sku: product.sku,
    name: product.name,
    imageUrl: product.imageUrl ?? "",
    purchasePrice: product.purchasePrice.toString(),
    sellingPrice: product.sellingPrice.toString(),
    stock: product.stock.toString(),
    minimumStock: product.minimumStock.toString(),
  }
}

function parseNonNegativeNumber(value: string): number | null {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null
}

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const { products, loading, error } = useAppSelector((state) => state.products)
  const categories = useAppSelector((state) => state.categories.categories)
  const suppliers = useAppSelector((state) => state.suppliers.suppliers)
  const role = useAppSelector((state) => state.auth.user?.role)
  const canManageProducts = role === "admin"
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchProducts())
    if (canManageProducts) {
      dispatch(fetchCategories())
      dispatch(fetchSuppliers())
    }
  }, [canManageProducts, dispatch])

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return products
    }

    return products.filter((product) =>
      [
        product.sku,
        product.name,
        product.category.name,
        product.supplier.name,
      ].some((value) => value.toLowerCase().includes(keyword))
    )
  }, [products, search])

  const openCreateForm = () => {
    dispatch(clearProductError())
    setEditingProduct(null)
    setForm(emptyForm)
    setFormError(null)
    setMessage(null)
    setFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    dispatch(clearProductError())
    setEditingProduct(product)
    setForm(toProductForm(product))
    setFormError(null)
    setMessage(null)
    setFormOpen(true)
  }

  const buildPayload = (): ProductPayload | null => {
    const categoryId = Number(form.categoryId)
    const supplierId = Number(form.supplierId)
    const purchasePrice = parseNonNegativeNumber(form.purchasePrice)
    const sellingPrice = parseNonNegativeNumber(form.sellingPrice)
    const stock = parseNonNegativeNumber(form.stock)
    const minimumStock = parseNonNegativeNumber(form.minimumStock)

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setFormError("Kategori produk wajib dipilih")
      return null
    }
    if (!Number.isInteger(supplierId) || supplierId <= 0) {
      setFormError("Supplier produk wajib dipilih")
      return null
    }
    if (!form.sku.trim() || !form.name.trim()) {
      setFormError("SKU dan nama produk wajib diisi")
      return null
    }
    if (
      purchasePrice === null ||
      sellingPrice === null ||
      stock === null ||
      minimumStock === null ||
      !Number.isInteger(stock) ||
      !Number.isInteger(minimumStock)
    ) {
      setFormError("Harga dan stok harus berupa angka tidak negatif")
      return null
    }

    return {
      category_id: categoryId,
      supplier_id: supplierId,
      sku: form.sku.trim(),
      name: form.name.trim(),
      image_url: form.imageUrl.trim() || null,
      purchase_price: purchasePrice,
      selling_price: sellingPrice,
      stock,
      minimum_stock: minimumStock,
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = buildPayload()
    if (!payload) {
      return
    }

    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, payload })).unwrap()
        setMessage("Produk berhasil diperbarui")
      } else {
        await dispatch(createProduct(payload)).unwrap()
        setMessage("Produk berhasil ditambahkan")
      }
      setFormOpen(false)
    } catch {
      return
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await dispatch(deleteProduct(deleteTarget.id)).unwrap()
      setMessage("Produk berhasil dihapus")
      setDeleteTarget(null)
    } catch {
      return
    }
  }

  const setField = (field: keyof ProductForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFormError(null)
  }
  const tableColumnCount = canManageProducts ? 6 : 5

  return (
    <ManagementPageLayout
      title="Produk"
      description="Kelola identitas produk, harga, supplier, dan stok."
      addLabel={canManageProducts ? "Tambah produk" : undefined}
      searchValue={search}
      searchPlaceholder="Cari SKU, produk, kategori, atau supplier..."
      message={message}
      error={error}
      onAdd={canManageProducts ? openCreateForm : undefined}
      onSearchChange={setSearch}
    >
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Harga jual</TableHead>
              <TableHead>Stok</TableHead>
              {canManageProducts && <TableHead className="w-28 text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={tableColumnCount} className="h-24 text-center text-muted-foreground">
                  Memuat produk...
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={tableColumnCount} className="h-24 text-center text-muted-foreground">
                  Belum ada produk yang cocok.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const lowStock = product.stock <= product.minimumStock

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProductThumbnail
                          src={product.imageUrl}
                          alt={`Gambar ${product.name}`}
                          size="small"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell>{product.supplier.name}</TableCell>
                    <TableCell>{formatCurrency(product.sellingPrice)}</TableCell>
                    <TableCell>
                      <Badge variant={lowStock ? "destructive" : "secondary"}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    {canManageProducts && (
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit produk"
                            onClick={() => openEditForm(product)}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Hapus produk"
                            onClick={() => setDeleteTarget(product)}
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {canManageProducts && (
        <>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent className="sm:max-w-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit produk" : "Tambah produk"}
                  </DialogTitle>
                  <DialogDescription>
                    Lengkapi informasi produk dan stok awal.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="product-sku">SKU</Label>
                    <Input
                      id="product-sku"
                      value={form.sku}
                      onChange={(event) => setField("sku", event.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-name">Nama produk</Label>
                    <Input
                      id="product-name"
                      value={form.name}
                      onChange={(event) => setField("name", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="product-image-url">URL gambar</Label>
                    <Input
                      id="product-image-url"
                      type="url"
                      value={form.imageUrl}
                      placeholder="https://contoh.com/gambar-produk.jpg"
                      onChange={(event) => setField("imageUrl", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Kategori</Label>
                    <Select
                      value={form.categoryId}
                      onValueChange={(value) => setField("categoryId", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Supplier</Label>
                    <Select
                      value={form.supplierId}
                      onValueChange={(value) => setField("supplierId", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchase-price">Harga beli</Label>
                    <Input
                      id="purchase-price"
                      type="number"
                      min="0"
                      value={form.purchasePrice}
                      onChange={(event) => setField("purchasePrice", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="selling-price">Harga jual</Label>
                    <Input
                      id="selling-price"
                      type="number"
                      min="0"
                      value={form.sellingPrice}
                      onChange={(event) => setField("sellingPrice", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-stock">Stok</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock}
                      onChange={(event) => setField("stock", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minimum-stock">Minimum stok</Label>
                    <Input
                      id="minimum-stock"
                      type="number"
                      min="0"
                      step="1"
                      value={form.minimumStock}
                      onChange={(event) => setField("minimumStock", event.target.value)}
                    />
                  </div>
                  {(formError || error) && (
                    <p className="text-sm text-destructive sm:col-span-2">
                      {formError || error}
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <DeleteConfirmDialog
            open={Boolean(deleteTarget)}
            itemName={deleteTarget?.name ?? ""}
            loading={loading}
            onOpenChange={(open) => {
              if (!open) {
                setDeleteTarget(null)
              }
            }}
            onConfirm={handleDelete}
          />
        </>
      )}
    </ManagementPageLayout>
  )
}

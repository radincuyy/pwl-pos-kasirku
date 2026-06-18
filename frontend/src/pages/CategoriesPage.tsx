import { useEffect, useMemo, useState, type FormEvent } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import type { Category, CategoryPayload } from "@/api/categoryService"
import { DeleteConfirmDialog } from "@/components/molecules/DeleteConfirmDialog"
import { ManagementPageLayout } from "@/components/templates/ManagementPageLayout"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/ui/table"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  clearCategoryError,
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/store/categorySlice"

const emptyForm: CategoryPayload = {
  name: "",
  description: "",
}

export default function CategoriesPage() {
  const dispatch = useAppDispatch()
  const { categories, loading, error } = useAppSelector((state) => state.categories)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<CategoryPayload>(emptyForm)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return categories
    }

    return categories.filter((category) =>
      [category.name, category.description ?? ""].some((value) =>
        value.toLowerCase().includes(keyword)
      )
    )
  }, [categories, search])

  const openCreateForm = () => {
    dispatch(clearCategoryError())
    setEditingCategory(null)
    setForm(emptyForm)
    setFormError(null)
    setMessage(null)
    setFormOpen(true)
  }

  const openEditForm = (category: Category) => {
    dispatch(clearCategoryError())
    setEditingCategory(category)
    setForm({
      name: category.name,
      description: category.description ?? "",
    })
    setFormError(null)
    setMessage(null)
    setFormOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = form.name.trim()

    if (!name) {
      setFormError("Nama kategori wajib diisi")
      return
    }

    const payload: CategoryPayload = {
      name,
      description: form.description?.trim() || null,
    }

    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, payload })).unwrap()
        setMessage("Kategori berhasil diperbarui")
      } else {
        await dispatch(createCategory(payload)).unwrap()
        setMessage("Kategori berhasil ditambahkan")
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
      await dispatch(deleteCategory(deleteTarget.id)).unwrap()
      setMessage("Kategori berhasil dihapus")
      setDeleteTarget(null)
    } catch {
      return
    }
  }

  return (
    <ManagementPageLayout
      title="Kategori"
      description="Kelompokkan produk agar mudah dicari dan dikelola."
      addLabel="Tambah kategori"
      searchValue={search}
      searchPlaceholder="Cari nama atau deskripsi..."
      message={message}
      error={error}
      onAdd={openCreateForm}
      onSearchChange={setSearch}
    >
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Memuat kategori...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Belum ada kategori yang cocok.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-md whitespace-normal text-muted-foreground">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit kategori"
                        onClick={() => openEditForm(category)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Hapus kategori"
                        onClick={() => setDeleteTarget(category)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit kategori" : "Tambah kategori"}
              </DialogTitle>
              <DialogDescription>
                Isi nama kategori dan deskripsi singkat bila diperlukan.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Nama kategori</Label>
                <Input
                  id="category-name"
                  value={form.name}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, name: event.target.value }))
                    setFormError(null)
                  }}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-description">Deskripsi</Label>
                <textarea
                  id="category-description"
                  value={form.description ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              {(formError || error) && (
                <p className="text-sm text-destructive">{formError || error}</p>
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
    </ManagementPageLayout>
  )
}

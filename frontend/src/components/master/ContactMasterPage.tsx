import { useMemo, useState, type FormEvent } from "react"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/master/DeleteConfirmDialog"
import { MasterPageLayout } from "@/components/master/MasterPageLayout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type ContactRecord = {
  id: number
  name: string
  phone: string | null
  address: string | null
}

export type ContactPayload = {
  name: string
  phone?: string | null
  address?: string | null
}

type ContactMasterPageProps = {
  title: string
  description: string
  singularLabel: string
  records: ContactRecord[]
  loading: boolean
  error: string | null
  onClearError: () => void
  onCreate: (payload: ContactPayload) => Promise<void>
  onUpdate: (id: number, payload: ContactPayload) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

const emptyForm: ContactPayload = {
  name: "",
  phone: "",
  address: "",
}

export function ContactMasterPage({
  title,
  description,
  singularLabel,
  records,
  loading,
  error,
  onClearError,
  onCreate,
  onUpdate,
  onDelete,
}: ContactMasterPageProps) {
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<ContactPayload>(emptyForm)
  const [editingRecord, setEditingRecord] = useState<ContactRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactRecord | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) {
      return records
    }

    return records.filter((record) =>
      [record.name, record.phone ?? "", record.address ?? ""].some((value) =>
        value.toLowerCase().includes(keyword)
      )
    )
  }, [records, search])

  const openCreateForm = () => {
    onClearError()
    setEditingRecord(null)
    setForm(emptyForm)
    setFormError(null)
    setMessage(null)
    setFormOpen(true)
  }

  const openEditForm = (record: ContactRecord) => {
    onClearError()
    setEditingRecord(record)
    setForm({
      name: record.name,
      phone: record.phone ?? "",
      address: record.address ?? "",
    })
    setFormError(null)
    setMessage(null)
    setFormOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = form.name.trim()

    if (!name) {
      setFormError(`Nama ${singularLabel.toLowerCase()} wajib diisi`)
      return
    }

    const payload: ContactPayload = {
      name,
      phone: form.phone?.trim() || null,
      address: form.address?.trim() || null,
    }

    try {
      if (editingRecord) {
        await onUpdate(editingRecord.id, payload)
        setMessage(`${singularLabel} berhasil diperbarui`)
      } else {
        await onCreate(payload)
        setMessage(`${singularLabel} berhasil ditambahkan`)
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
      await onDelete(deleteTarget.id)
      setMessage(`${singularLabel} berhasil dihapus`)
      setDeleteTarget(null)
    } catch {
      return
    }
  }

  return (
    <MasterPageLayout
      title={title}
      description={description}
      addLabel={`Tambah ${singularLabel.toLowerCase()}`}
      searchValue={search}
      searchPlaceholder={`Cari ${singularLabel.toLowerCase()}...`}
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
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="w-28 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Belum ada data yang cocok.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.phone || "-"}</TableCell>
                  <TableCell className="max-w-md whitespace-normal text-muted-foreground">
                    {record.address || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={`Edit ${singularLabel.toLowerCase()}`}
                        onClick={() => openEditForm(record)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={`Hapus ${singularLabel.toLowerCase()}`}
                        onClick={() => setDeleteTarget(record)}
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
                {editingRecord ? `Edit ${singularLabel}` : `Tambah ${singularLabel}`}
              </DialogTitle>
              <DialogDescription>
                Lengkapi identitas dan informasi kontak.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Nama</Label>
                <Input
                  id="contact-name"
                  value={form.name}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, name: event.target.value }))
                    setFormError(null)
                  }}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Nomor telepon</Label>
                <Input
                  id="contact-phone"
                  value={form.phone ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-address">Alamat</Label>
                <textarea
                  id="contact-address"
                  value={form.address ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, address: event.target.value }))
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
    </MasterPageLayout>
  )
}

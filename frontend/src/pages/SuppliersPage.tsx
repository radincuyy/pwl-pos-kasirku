import { useEffect } from "react"
import type { SupplierPayload } from "@/api/supplierService"
import { ContactMasterPage } from "@/components/master/ContactMasterPage"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  clearSupplierError,
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier,
} from "@/store/supplierSlice"

export default function SuppliersPage() {
  const dispatch = useAppDispatch()
  const { suppliers, loading, error } = useAppSelector((state) => state.suppliers)

  useEffect(() => {
    dispatch(fetchSuppliers())
  }, [dispatch])

  return (
    <ContactMasterPage
      title="Supplier"
      description="Kelola pemasok produk dan informasi kontaknya."
      singularLabel="Supplier"
      records={suppliers}
      loading={loading}
      error={error}
      onClearError={() => dispatch(clearSupplierError())}
      onCreate={async (payload) => {
        await dispatch(createSupplier(payload as SupplierPayload)).unwrap()
      }}
      onUpdate={async (id, payload) => {
        await dispatch(
          updateSupplier({ id, payload: payload as SupplierPayload })
        ).unwrap()
      }}
      onDelete={async (id) => {
        await dispatch(deleteSupplier(id)).unwrap()
      }}
    />
  )
}

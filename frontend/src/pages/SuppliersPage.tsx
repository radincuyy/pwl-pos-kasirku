import { useEffect } from "react"
import type { SupplierPayload } from "@/api/supplierService"
import { ContactManagementTemplate } from "@/components/templates/ContactManagementTemplate"
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
  const role = useAppSelector((state) => state.auth.user?.role)
  const canManageSuppliers = role === "admin"

  useEffect(() => {
    dispatch(fetchSuppliers())
  }, [dispatch])

  return (
    <ContactManagementTemplate
      title="Supplier"
      description="Kelola pemasok produk dan informasi kontaknya."
      singularLabel="Supplier"
      canManage={canManageSuppliers}
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

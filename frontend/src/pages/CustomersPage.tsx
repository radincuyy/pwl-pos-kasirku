import { useEffect } from "react"

import type { CustomerPayload } from "@/api/customerService"
import { ContactManagementTemplate } from "@/components/templates/ContactManagementTemplate"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  clearCustomerError,
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from "@/store/customerSlice"

export default function CustomersPage() {
  const dispatch = useAppDispatch()
  const { customers, loading, error } = useAppSelector((state) => state.customers)
  const role = useAppSelector((state) => state.auth.user?.role)
  const canManageCustomers = role === "admin" || role === "kasir"

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  return (
    <ContactManagementTemplate
      title="Pelanggan"
      description="Data pelanggan bersifat opsional untuk pembeli yang ingin dicatat."
      singularLabel="Pelanggan"
      canManage={canManageCustomers}
      records={customers}
      loading={loading}
      error={error}
      onClearError={() => dispatch(clearCustomerError())}
      onCreate={async (payload) => {
        await dispatch(createCustomer(payload as CustomerPayload)).unwrap()
      }}
      onUpdate={async (id, payload) => {
        await dispatch(
          updateCustomer({ id, payload: payload as CustomerPayload })
        ).unwrap()
      }}
      onDelete={async (id) => {
        await dispatch(deleteCustomer(id)).unwrap()
      }}
    />
  )
}

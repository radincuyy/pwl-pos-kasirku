import { useEffect } from "react"
import type { CustomerPayload } from "@/api/customerService"
import { ContactMasterPage } from "@/components/master/ContactMasterPage"
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

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  return (
    <ContactMasterPage
      title="Pelanggan"
      description="Simpan identitas pelanggan untuk transaksi yang lebih cepat."
      singularLabel="Pelanggan"
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

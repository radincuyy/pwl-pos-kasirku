import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { MobileSaleCart } from "@/components/organisms/sales/MobileSaleCart"
import { ProductCatalog } from "@/components/organisms/sales/ProductCatalog"
import {
  SaleCart,
  type PaymentMethod,
  type SaleCartProps,
} from "@/components/organisms/sales/SaleCart"
import { SaleReceiptDialog } from "@/components/organisms/sales/SaleReceiptDialog"
import { SalesWorkspaceTemplate } from "@/components/templates/SalesWorkspaceTemplate"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchCustomers } from "@/store/customerSlice"
import { fetchProducts } from "@/store/productSlice"
import {
  addToCart,
  clearCart,
  clearCurrentSale,
  clearSaleError,
  createSale,
  removeFromCart,
  setCartCustomerId,
  setCartPaidAmount,
  setCartPaymentMethod,
  updateCartQuantity,
} from "@/store/saleSlice"

export default function NewSalePage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const products = useAppSelector((state) => state.products.products)
  const productsLoading = useAppSelector((state) => state.products.loading)
  const productsError = useAppSelector((state) => state.products.error)
  const customers = useAppSelector((state) => state.customers.customers)
  const customersError = useAppSelector((state) => state.customers.error)
  const {
    cart,
    selectedCustomerId,
    paymentMethod,
    paidAmount,
    currentSale,
    loading,
    error,
  } = useAppSelector((state) => state.sales)
  const [search, setSearch] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCustomers())
    dispatch(clearSaleError())
    dispatch(clearCurrentSale())
  }, [dispatch])

  const totalAmount = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.product.sellingPrice * item.quantity,
        0
      ),
    [cart]
  )

  const cartQuantities = useMemo(
    () =>
      Object.fromEntries(
        cart.map((item) => [item.product.id, item.quantity])
      ) as Record<number, number>,
    [cart]
  )

  const cartItemCount = useMemo(
    () => cart.reduce((itemCount, item) => itemCount + item.quantity, 0),
    [cart]
  )

  const changeAmount = Math.max(0, paidAmount - totalAmount)
  const dataError = productsError ?? customersError

  useEffect(() => {
    if (paymentMethod !== "cash" && paidAmount !== totalAmount) {
      dispatch(setCartPaidAmount(totalAmount))
    }
  }, [dispatch, paidAmount, paymentMethod, totalAmount])

  const handleCheckout = async (): Promise<void> => {
    if (cart.length === 0) {
      setValidationError("Keranjang transaksi masih kosong")
      return
    }

    if (paidAmount < totalAmount) {
      setValidationError("Nominal bayar belum mencukupi")
      return
    }

    setValidationError(null)
    dispatch(clearSaleError())

    try {
      await dispatch(
        createSale({
          customer_id: selectedCustomerId,
          payment_method: paymentMethod,
          paid_amount: paidAmount,
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        })
      ).unwrap()
      await dispatch(fetchProducts()).unwrap()
      setMobileCartOpen(false)
    } catch {
      return
    }
  }

  const handlePaymentMethodChange = (method: PaymentMethod): void => {
    dispatch(setCartPaymentMethod(method))

    if (method !== "cash") {
      dispatch(setCartPaidAmount(totalAmount))
    }
  }

  const handleReceiptOpenChange = (open: boolean): void => {
    if (!open) {
      dispatch(clearCurrentSale())
    }
  }

  const saleCartProps = {
    cart,
    customers,
    selectedCustomerId,
    paymentMethod,
    paidAmount,
    totalAmount,
    changeAmount,
    loading,
    error: validationError ?? error,
    onCheckout: handleCheckout,
    onClearCart: () => dispatch(clearCart()),
    onCustomerChange: (customerId) =>
      dispatch(setCartCustomerId(customerId)),
    onPaidAmountChange: (amount) => {
      setValidationError(null)
      dispatch(setCartPaidAmount(amount))
    },
    onPaymentMethodChange: handlePaymentMethodChange,
    onRemoveItem: (productId) => dispatch(removeFromCart(productId)),
    onUpdateQuantity: (productId, quantity) =>
      dispatch(updateCartQuantity({ productId, quantity })),
  } satisfies Omit<SaleCartProps, "displayMode">

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div>
        <h2 className="text-2xl font-semibold">Transaksi baru</h2>
        <p className="text-sm text-muted-foreground">
          Pilih produk, atur pembayaran, lalu simpan transaksi.
        </p>
      </div>

      {dataError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {dataError}
        </div>
      )}

      <SalesWorkspaceTemplate
        catalog={
          <ProductCatalog
            products={products}
            cartQuantities={cartQuantities}
            loading={productsLoading}
            searchValue={search}
            onAddProduct={(product) => {
              setValidationError(null)
              dispatch(addToCart(product))
            }}
            onSearchChange={setSearch}
          />
        }
        checkout={
          <SaleCart {...saleCartProps} displayMode="panel" />
        }
        mobileCheckout={
          <MobileSaleCart
            open={mobileCartOpen}
            itemCount={cartItemCount}
            totalAmount={totalAmount}
            onOpenChange={setMobileCartOpen}
          >
            <SaleCart {...saleCartProps} displayMode="sheet" />
          </MobileSaleCart>
        }
      />

      <SaleReceiptDialog
        open={Boolean(currentSale)}
        sale={currentSale}
        onOpenChange={handleReceiptOpenChange}
        onViewHistory={() => navigate("/sales")}
      />
    </div>
  )
}

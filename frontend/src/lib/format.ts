const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value))
}

export function formatPaymentMethod(value: string): string {
  const labels: Record<string, string> = {
    cash: "Tunai",
    transfer: "Transfer",
    qris: "QRIS",
    debit: "Debit",
  }

  return labels[value] ?? value
}

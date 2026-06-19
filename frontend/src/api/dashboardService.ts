import api from "./axios"

export interface RecentDashboardSale {
  id: number
  invoiceNumber: string
  cashierName: string
  customerName: string | null
  totalAmount: number
  paymentMethod: string
  status: string
  saleDate: string
}

export interface DashboardSummary {
  totalProducts: number
  totalSales: number
  revenueToday: number
  lowStockProducts: {
    id: number
    sku: string
    name: string
    stock: number
    minimumStock: number
    categoryName: string
  }[]
  recentSales: RecentDashboardSale[]
}

export interface CashierDashboardSummary {
  totalSalesToday: number
  revenueToday: number
  itemsSoldToday: number
  recentSales: RecentDashboardSale[]
}

export const dashboardService = {
  getSummary: () =>
    api.get<{
      success: boolean
      message: string
      data: { summary: DashboardSummary }
    }>("/dashboard/summary"),

  getCashierSummary: () =>
    api.get<{
      success: boolean
      message: string
      data: { summary: CashierDashboardSummary }
    }>("/dashboard/cashier-summary"),
}

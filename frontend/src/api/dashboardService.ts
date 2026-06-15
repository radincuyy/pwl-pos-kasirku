import api from "./axios";

export interface DashboardSummary {
  totalProducts: number;
  totalSales: number;
  revenueToday: number;
  lowStockProducts: {
    id: number;
    sku: string;
    name: string;
    stock: number;
    minimumStock: number;
    categoryName: string;
  }[];
  recentSales: {
    id: number;
    invoiceNumber: string;
    cashierName: string;
    customerName: string | null;
    totalAmount: number;
    paymentMethod: string;
    status: string;
    saleDate: string;
  }[];
}

export const dashboardService = {
  getSummary: () =>
    api.get<{
      success: boolean;
      message: string;
      data: { summary: DashboardSummary };
    }>("/dashboard/summary"),
};

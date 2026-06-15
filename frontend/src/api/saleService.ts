import api from "./axios";

export interface SaleSummary {
  id: number;
  invoiceNumber: string;
  userId: number;
  cashierName: string;
  customerId: number | null;
  customerName: string | null;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: string;
  status: string;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface SaleDetail extends SaleSummary {
  items: SaleItem[];
}

export interface SalePayload {
  customer_id?: number | null;
  payment_method: "cash" | "transfer" | "qris" | "debit";
  paid_amount: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export const saleService = {
  getAll: () =>
    api.get<{
      success: boolean;
      message: string;
      data: { sales: SaleSummary[] };
    }>("/sales"),

  getById: (id: number) =>
    api.get<{
      success: boolean;
      message: string;
      data: { sale: SaleDetail };
    }>(`/sales/${id}`),

  create: (payload: SalePayload) =>
    api.post<{
      success: boolean;
      message: string;
      data: { sale: SaleDetail };
    }>("/sales", payload),
};

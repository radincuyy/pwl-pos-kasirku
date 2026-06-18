import api from "./axios";

export interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPayload {
  name: string;
  phone?: string | null;
  address?: string | null;
}

export const supplierService = {
  getAll: () =>
    api.get<{
      success: boolean;
      message: string;
      data: { suppliers: Supplier[] };
    }>("/suppliers"),

  getById: (id: number) =>
    api.get<{
      success: boolean;
      message: string;
      data: { supplier: Supplier };
    }>(`/suppliers/${id}`),

  create: (payload: SupplierPayload) =>
    api.post<{
      success: boolean;
      message: string;
      data: { supplier: Supplier };
    }>("/suppliers", payload),

  update: (id: number, payload: SupplierPayload) =>
    api.put<{
      success: boolean;
      message: string;
      data: { supplier: Supplier };
    }>(`/suppliers/${id}`, payload),

  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/suppliers/${id}`),
};

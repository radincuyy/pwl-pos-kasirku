import api from "./axios";

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPayload {
  name: string;
  phone?: string | null;
  address?: string | null;
}

export const customerService = {
  getAll: () =>
    api.get<{
      success: boolean;
      message: string;
      data: { customers: Customer[] };
    }>("/customers"),

  getById: (id: number) =>
    api.get<{
      success: boolean;
      message: string;
      data: { customer: Customer };
    }>(`/customers/${id}`),

  create: (payload: CustomerPayload) =>
    api.post<{
      success: boolean;
      message: string;
      data: { customer: Customer };
    }>("/customers", payload),

  update: (id: number, payload: CustomerPayload) =>
    api.put<{
      success: boolean;
      message: string;
      data: { customer: Customer };
    }>(`/customers/${id}`, payload),

  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/customers/${id}`),
};

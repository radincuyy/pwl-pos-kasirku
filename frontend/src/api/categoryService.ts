import api from "./axios";

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
}

export const categoryService = {
  getAll: () =>
    api.get<{
      success: boolean;
      message: string;
      data: { categories: Category[] };
    }>("/categories"),

  getById: (id: number) =>
    api.get<{
      success: boolean;
      message: string;
      data: { category: Category };
    }>(`/categories/${id}`),

  create: (payload: CategoryPayload) =>
    api.post<{
      success: boolean;
      message: string;
      data: { category: Category };
    }>("/categories", payload),

  update: (id: number, payload: CategoryPayload) =>
    api.put<{
      success: boolean;
      message: string;
      data: { category: Category };
    }>(`/categories/${id}`, payload),

  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/categories/${id}`),
};

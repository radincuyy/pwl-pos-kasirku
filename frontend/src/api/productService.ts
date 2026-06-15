import api from "./axios";

export interface Product {
  id: number;
  categoryId: number;
  supplierId: number;
  category: { id: number; name: string };
  supplier: { id: number; name: string };
  sku: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  category_id: number;
  supplier_id: number;
  sku: string;
  name: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  minimum_stock: number;
}

export const productService = {
  getAll: () =>
    api.get<{
      success: boolean;
      message: string;
      data: { products: Product[] };
    }>("/products"),

  getById: (id: number) =>
    api.get<{
      success: boolean;
      message: string;
      data: { product: Product };
    }>(`/products/${id}`),

  create: (payload: ProductPayload) =>
    api.post<{
      success: boolean;
      message: string;
      data: { product: Product };
    }>("/products", payload),

  update: (id: number, payload: ProductPayload) =>
    api.put<{
      success: boolean;
      message: string;
      data: { product: Product };
    }>(`/products/${id}`, payload),

  delete: (id: number) =>
    api.delete<{ success: boolean; message: string }>(`/products/${id}`),
};

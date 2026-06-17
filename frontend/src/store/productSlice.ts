import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../api/productService";
import { getApiErrorMessage } from "../api/error";
import type { Product, ProductPayload } from "../api/productService";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAll();
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch products");
      }
      return data.products;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch products"));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productService.getById(id);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch product");
      }
      return data.product;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch product"));
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (payload: ProductPayload, { rejectWithValue }) => {
    try {
      const response = await productService.create(payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to create product");
      }
      return data.product;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to create product"));
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (
    { id, payload }: { id: number; payload: ProductPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.update(id, payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to update product");
      }
      return data.product;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to update product"));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productService.delete(id);
      const { success, message } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to delete product");
      }
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to delete product"));
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchById
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;

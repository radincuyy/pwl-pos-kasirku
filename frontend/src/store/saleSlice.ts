import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { saleService } from "../api/saleService";
import { getApiErrorMessage } from "../api/error";
import type { SaleSummary, SaleDetail, SalePayload } from "../api/saleService";
import type { Product } from "../api/productService";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface SaleState {
  sales: SaleSummary[];
  currentSale: SaleDetail | null;
  loading: boolean;
  error: string | null;
  cart: CartItem[];
  selectedCustomerId: number | null;
  paymentMethod: "cash" | "transfer" | "qris" | "debit";
  paidAmount: number;
}

const initialState: SaleState = {
  sales: [],
  currentSale: null,
  loading: false,
  error: null,
  cart: [],
  selectedCustomerId: null,
  paymentMethod: "cash",
  paidAmount: 0,
};

export const fetchSales = createAsyncThunk(
  "sales/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await saleService.getAll();
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch sales");
      }
      return data.sales;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch sales"));
    }
  }
);

export const fetchSaleById = createAsyncThunk(
  "sales/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await saleService.getById(id);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch sale details");
      }
      return data.sale;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch sale details"));
    }
  }
);

export const createSale = createAsyncThunk(
  "sales/create",
  async (payload: SalePayload, { rejectWithValue }) => {
    try {
      const response = await saleService.create(payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to process sale");
      }
      return data.sale;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to process sale"));
    }
  }
);

const saleSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSaleError: (state) => {
      state.error = null;
    },
    clearCurrentSale: (state) => {
      state.currentSale = null;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.cart.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else {
        if (product.stock > 0) {
          state.cart.push({ product, quantity: 1 });
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item.product.id !== productId);
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find((item) => item.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter((item) => item.product.id !== productId);
        } else if (quantity <= item.product.stock) {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
      state.selectedCustomerId = null;
      state.paymentMethod = "cash";
      state.paidAmount = 0;
    },
    setCartCustomerId: (state, action: PayloadAction<number | null>) => {
      state.selectedCustomerId = action.payload;
    },
    setCartPaymentMethod: (
      state,
      action: PayloadAction<"cash" | "transfer" | "qris" | "debit">
    ) => {
      state.paymentMethod = action.payload;
    },
    setCartPaidAmount: (state, action: PayloadAction<number>) => {
      state.paidAmount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchById
      .addCase(fetchSaleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSale = action.payload;
      })
      .addCase(fetchSaleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create
      .addCase(createSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.loading = false;
        state.sales.unshift(action.payload);
        state.currentSale = action.payload;
        state.cart = [];
        state.selectedCustomerId = null;
        state.paymentMethod = "cash";
        state.paidAmount = 0;
      })
      .addCase(createSale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearSaleError,
  clearCurrentSale,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setCartCustomerId,
  setCartPaymentMethod,
  setCartPaidAmount,
} = saleSlice.actions;

export default saleSlice.reducer;

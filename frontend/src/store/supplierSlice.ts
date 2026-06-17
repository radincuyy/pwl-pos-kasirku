import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supplierService } from "../api/supplierService";
import { getApiErrorMessage } from "../api/error";
import type { Supplier, SupplierPayload } from "../api/supplierService";

interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null,
};

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await supplierService.getAll();
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch suppliers");
      }
      return data.suppliers;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch suppliers"));
    }
  }
);

export const fetchSupplierById = createAsyncThunk(
  "suppliers/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await supplierService.getById(id);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch supplier");
      }
      return data.supplier;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch supplier"));
    }
  }
);

export const createSupplier = createAsyncThunk(
  "suppliers/create",
  async (payload: SupplierPayload, { rejectWithValue }) => {
    try {
      const response = await supplierService.create(payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to create supplier");
      }
      return data.supplier;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to create supplier"));
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "suppliers/update",
  async (
    { id, payload }: { id: number; payload: SupplierPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await supplierService.update(id, payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to update supplier");
      }
      return data.supplier;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to update supplier"));
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "suppliers/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await supplierService.delete(id);
      const { success, message } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to delete supplier");
      }
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to delete supplier"));
    }
  }
);

const supplierSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    clearSupplierError: (state) => {
      state.error = null;
    },
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchById
      .addCase(fetchSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers.push(action.payload);
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.suppliers.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        if (state.currentSupplier?.id === action.payload.id) {
          state.currentSupplier = action.payload;
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // delete
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSupplierError, clearCurrentSupplier } = supplierSlice.actions;
export default supplierSlice.reducer;

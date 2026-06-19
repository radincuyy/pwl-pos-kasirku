import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customerService } from "../api/customerService";
import { getApiErrorMessage } from "../api/error";
import type { Customer, CustomerPayload } from "../api/customerService";

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  currentCustomer: null,
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerService.getAll();
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch customers");
      }
      return data.customers;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch customers"));
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await customerService.getById(id);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch customer");
      }
      return data.customer;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch customer"));
    }
  }
);

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (payload: CustomerPayload, { rejectWithValue }) => {
    try {
      const response = await customerService.create(payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to create customer");
      }
      return data.customer;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to create customer"));
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (
    { id, payload }: { id: number; payload: CustomerPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await customerService.update(id, payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to update customer");
      }
      return data.customer;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to update customer"));
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await customerService.delete(id);
      const { success, message } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to delete customer");
      }
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to delete customer"));
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex((customer) => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer?.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((customer) => customer.id !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCustomerError, clearCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;

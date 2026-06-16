import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardService } from "../api/dashboardService";
import type { DashboardSummary } from "../api/dashboardService";

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  loading: false,
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getSummary();
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Failed to fetch dashboard summary");
      }
      return data.summary;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch dashboard summary"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

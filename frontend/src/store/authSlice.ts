import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../api/authService";
import { getApiErrorMessage } from "../api/error";
import type { LoginPayload, User } from "../api/authService";
import { isUserRole } from "@/lib/access-control";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

function isStoredUser(value: unknown): value is User {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "number" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    isUserRole(user.role)
  );
}

const getInitialUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    const storedUser: unknown = userStr ? JSON.parse(userStr) : null;

    if (isStoredUser(storedUser)) {
      return storedUser;
    }
  } catch {
    localStorage.removeItem("user");
  }

  localStorage.removeItem("token");
  return null;
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(payload);
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Login failed");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Something went wrong"));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      await authService.logout();
    } catch (error) {
      void error;
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
);

export const checkAuthMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      const { success, message, data } = response.data;
      if (!success) {
        return rejectWithValue(message || "Session validation failed");
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return rejectWithValue(getApiErrorMessage(error, "Unauthorized"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    localLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      // Check Auth
      .addCase(checkAuthMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(checkAuthMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, localLogout } = authSlice.actions;
export default authSlice.reducer;

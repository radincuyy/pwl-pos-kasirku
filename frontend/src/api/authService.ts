import api from "./axios";
import type { UserRole } from "@/lib/access-control";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<{ success: boolean; message: string; data: LoginResponse }>(
      "/auth/login",
      payload
    ),

  getMe: () =>
    api.get<{ success: boolean; message: string; data: { user: User } }>(
      "/auth/me"
    ),

  logout: () =>
    api.post<{ success: boolean; message: string }>("/auth/logout"),
};

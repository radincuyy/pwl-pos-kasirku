"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/store"

export default function ProtectedRoute() {
  const { token, user } = useAppSelector((state) => state.auth)

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

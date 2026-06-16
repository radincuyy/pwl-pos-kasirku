"use client"

import * as React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/store"

export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

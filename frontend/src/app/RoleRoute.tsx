import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import type { UserRole } from "@/lib/access-control"
import { getDefaultRoute, hasAllowedRole } from "@/lib/access-control"
import { useAppSelector } from "@/store"

type RoleRouteProps = {
  allowedRoles: readonly UserRole[]
  children: ReactNode
}

export default function RoleRoute({
  allowedRoles,
  children,
}: RoleRouteProps) {
  const user = useAppSelector((state) => state.auth.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasAllowedRole(user.role, allowedRoles)) {
    return <Navigate to={getDefaultRoute(user.role)} replace />
  }

  return children
}

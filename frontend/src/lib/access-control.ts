export const userRoles = ["admin", "kasir", "owner"] as const

export type UserRole = (typeof userRoles)[number]

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  kasir: "Kasir",
  owner: "Owner",
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.some((role) => role === value)
}

export function hasAllowedRole(
  role: UserRole,
  allowedRoles: readonly UserRole[]
): boolean {
  return allowedRoles.includes(role)
}

export function getDefaultRoute(role: UserRole): string {
  if (role === "kasir") {
    return "/sales/new"
  }

  return "/"
}

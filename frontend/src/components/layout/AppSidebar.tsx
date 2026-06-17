"use client"

import { useState, type ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Box, FileText, Home, LogOut, ShoppingCart, Tag, Truck, Users } from "lucide-react"
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAppDispatch, useAppSelector } from "@/store"
import { localLogout, logoutUser } from "@/store/authSlice"

type MenuItem = {
  label: string
  path: string
  icon: ReactNode
}

const menus: MenuItem[] = [
  { label: "Dashboard", path: "/", icon: <Home className="size-4" /> },
  { label: "Master Produk", path: "/products", icon: <Box className="size-4" /> },
  { label: "Master Kategori", path: "/categories", icon: <Tag className="size-4" /> },
  { label: "Data Supplier", path: "/suppliers", icon: <Truck className="size-4" /> },
  { label: "Data Pelanggan", path: "/customers", icon: <Users className="size-4" /> },
  { label: "Riwayat Penjualan", path: "/sales", icon: <FileText className="size-4" /> },
  { label: "Transaksi Baru (POS)", path: "/sales/new", icon: <ShoppingCart className="size-4" /> },
]

export function AppSidebar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await dispatch(logoutUser()).unwrap()
    } catch (error) {
      void error
    } finally {
      setLoading(false)
      dispatch(localLogout())
      navigate("/login", { replace: true })
    }
  }

  return (
    <aside className="flex h-full min-h-0 flex-col bg-muted/5">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary px-2 py-1 text-sm font-semibold text-primary-foreground">POS</div>
          <div className="text-sm font-medium">KasirKu</div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2 flex-1">
        <SidebarMenu>
          {menus.map((menu) => (
            <SidebarMenuItem key={menu.path}>
              <NavLink
                to={menu.path}
                end={menu.path === "/"}
                className={({ isActive }) =>
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                  (isActive
                    ? "bg-accent/20 text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground")
                }
              >
                <span className="text-current">{menu.icon}</span>
                <span className="truncate">{menu.label}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-4 px-3">
          <NavLink
            to="/sales/new"
            className={({ isActive }) =>
              "flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium " +
              (isActive
                ? "bg-primary text-primary-foreground"
                : "bg-primary/90 text-primary-foreground hover:brightness-105")
            }
          >
            <ShoppingCart className="size-4" />
            New Sale
          </NavLink>
        </div>
      </SidebarContent>

      <div className="px-3 py-3 border-t">
        <div className="text-xs text-muted-foreground mb-2">{user?.email}</div>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  )
}

export default AppSidebar

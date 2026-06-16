"use client"

import * as React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Home, Box, Tag, Truck, Users, FileText, ShoppingCart, LogOut } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { logoutUser, localLogout } from "@/store/authSlice"
import { useState } from "react"

type MenuItem = {
  label: string
  path: string
  icon?: React.ReactNode
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
  const user = useAppSelector((s) => s.auth.user)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await dispatch(logoutUser()).unwrap()
    } catch (err) {
      // ignore
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
          {menus.map((m) => (
            <SidebarMenuItem key={m.path}>
              <NavLink to={m.path} end={m.path === "/"}>
                {({ isActive }) => (
                  <SidebarMenuButton asChild isActive={!!isActive}>
                    <a
                      className={
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors " +
                        (isActive
                          ? "bg-accent/20 text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/10")
                      }
                    >
                      <span className="text-muted-foreground group-data-[active=true]:text-accent-foreground">{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </a>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-4 px-3">
          <NavLink to="/sales/new">
            {({ isActive }) => (
              <button className={"w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium " + (isActive ? "bg-primary text-primary-foreground" : "bg-primary/90 text-primary-foreground hover:brightness-105") }>
                <ShoppingCart className="size-4" />
                New Sale
              </button>
            )}
          </NavLink>
        </div>
      </SidebarContent>

      <div className="px-3 py-3 border-t">
        <div className="text-xs text-muted-foreground mb-2">{user?.email}</div>
        <button onClick={handleLogout} disabled={loading} className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-destructive/10">
          <LogOut className="size-4" />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  )
}

export default AppSidebar;

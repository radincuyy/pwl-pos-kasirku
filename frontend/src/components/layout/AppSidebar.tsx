"use client"

import { NavLink } from "react-router-dom"
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

type MenuItem = {
  label: string
  path: string
}

const menus: MenuItem[] = [
  { label: "Dashboard", path: "/" },
  { label: "Master Produk", path: "/products" },
  { label: "Master Kategori", path: "/categories" },
  { label: "Data Supplier", path: "/suppliers" },
  { label: "Data Pelanggan", path: "/customers" },
  { label: "Riwayat Penjualan", path: "/sales" },
  { label: "Transaksi Baru (POS)", path: "/sales/new" },
]

export function AppSidebar() {
  return (
    <aside className="flex h-full min-h-0 flex-col">
      <SidebarHeader className="px-3 py-2">
        <div className="text-sm font-medium">Menu</div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {menus.map((m) => (
            <SidebarMenuItem key={m.path}>
              <NavLink to={m.path} end={m.path === "/"}>
                {({ isActive }) => (
                  <SidebarMenuButton asChild isActive={!!isActive}>
                    <a className="flex items-center gap-2">{m.label}</a>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </aside>
  )
}

export default AppSidebar;

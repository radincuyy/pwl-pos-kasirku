import { useState, type ComponentProps } from "react"
import { Link, useNavigate } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAppDispatch, useAppSelector } from "@/store"
import { localLogout, logoutUser } from "@/store/authSlice"
import { BoxIcon, CommandIcon, LayoutDashboardIcon, ReceiptTextIcon, ShoppingCartIcon, TagsIcon, TruckIcon, UsersIcon } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Produk",
      url: "/products",
      icon: (
        <BoxIcon
        />
      ),
    },
    {
      title: "Kategori",
      url: "/categories",
      icon: (
        <TagsIcon
        />
      ),
    },
    {
      title: "Supplier",
      url: "/suppliers",
      icon: (
        <TruckIcon
        />
      ),
    },
    {
      title: "Pelanggan",
      url: "/customers",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Transaksi Baru",
      url: "/sales/new",
      icon: (
        <ShoppingCartIcon
        />
      ),
    },
    {
      title: "Riwayat Penjualan",
      url: "/sales",
      icon: (
        <ReceiptTextIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await dispatch(logoutUser()).unwrap()
    } catch (error) {
      void error
    } finally {
      setLoggingOut(false)
      dispatch(localLogout())
      navigate("/login", { replace: true })
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">KasirKu</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          loggingOut={loggingOut}
          onLogout={handleLogout}
          user={{
            name: user?.name ?? "Pengguna",
            email: user?.email ?? "user@kasirku.test",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}

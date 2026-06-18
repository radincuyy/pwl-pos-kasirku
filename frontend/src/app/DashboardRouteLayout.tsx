import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  BoxIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  ShoppingCartIcon,
  TagsIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react"

import DashboardLayout from "@/components/templates/DashboardLayout"
import type { SidebarNavigationItem } from "@/components/organisms/navigation/AppSidebar"
import { useAppDispatch, useAppSelector } from "@/store"
import { logoutUser } from "@/store/authSlice"

type SidebarNavigationDefinition = Omit<SidebarNavigationItem, "isActive">

const navigationDefinitions: SidebarNavigationDefinition[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Produk",
    url: "/products",
    icon: <BoxIcon />,
  },
  {
    title: "Kategori",
    url: "/categories",
    icon: <TagsIcon />,
  },
  {
    title: "Supplier",
    url: "/suppliers",
    icon: <TruckIcon />,
  },
  {
    title: "Pelanggan",
    url: "/customers",
    icon: <UsersIcon />,
  },
  {
    title: "Transaksi Baru",
    url: "/sales/new",
    icon: <ShoppingCartIcon />,
  },
  {
    title: "Riwayat Penjualan",
    url: "/sales",
    icon: <ReceiptTextIcon />,
  },
]

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Produk",
  "/categories": "Kategori",
  "/suppliers": "Supplier",
  "/customers": "Pelanggan",
  "/sales": "Riwayat Penjualan",
  "/sales/new": "Transaksi Baru",
}

function getRouteTitle(pathname: string): string {
  return routeTitles[pathname] ?? "KasirKu"
}

function getNavigationItems(pathname: string): SidebarNavigationItem[] {
  const activeUrl = navigationDefinitions
    .filter(
      (item) =>
        pathname === item.url ||
        (item.url !== "/" && pathname.startsWith(`${item.url}/`))
    )
    .sort((firstItem, secondItem) => secondItem.url.length - firstItem.url.length)[0]?.url

  return navigationDefinitions.map((item) => ({
    ...item,
    isActive: item.url === activeUrl,
  }))
}

export default function DashboardRouteLayout() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async (): Promise<void> => {
    setLoggingOut(true)

    try {
      await dispatch(logoutUser()).unwrap()
      navigate("/login", { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <DashboardLayout
      title={getRouteTitle(location.pathname)}
      navigationItems={getNavigationItems(location.pathname)}
      loggingOut={loggingOut}
      onLogout={handleLogout}
      user={{
        name: user?.name ?? "Pengguna",
        email: user?.email ?? "user@kasirku.test",
        avatar: "",
      }}
    >
      <Outlet />
    </DashboardLayout>
  )
}

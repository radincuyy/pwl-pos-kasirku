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
import {
  getDefaultRoute,
  hasAllowedRole,
  roleLabels,
  type UserRole,
} from "@/lib/access-control"

type SidebarNavigationDefinition = Omit<SidebarNavigationItem, "isActive"> & {
  allowedRoles: readonly UserRole[]
}

const navigationDefinitions: SidebarNavigationDefinition[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: <LayoutDashboardIcon />,
    allowedRoles: ["admin", "kasir", "owner"],
  },
  {
    title: "Produk",
    url: "/products",
    icon: <BoxIcon />,
    allowedRoles: ["admin", "owner"],
  },
  {
    title: "Kategori",
    url: "/categories",
    icon: <TagsIcon />,
    allowedRoles: ["admin", "owner"],
  },
  {
    title: "Supplier",
    url: "/suppliers",
    icon: <TruckIcon />,
    allowedRoles: ["admin", "owner"],
  },
  {
    title: "Pelanggan",
    url: "/customers",
    icon: <UsersIcon />,
    allowedRoles: ["admin", "kasir", "owner"],
  },
  {
    title: "Transaksi Baru",
    url: "/sales/new",
    icon: <ShoppingCartIcon />,
    allowedRoles: ["admin", "kasir"],
  },
  {
    title: "Riwayat Penjualan",
    url: "/sales",
    icon: <ReceiptTextIcon />,
    allowedRoles: ["admin", "kasir", "owner"],
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

function getNavigationItems(
  pathname: string,
  role: UserRole
): SidebarNavigationItem[] {
  const allowedItems = navigationDefinitions.filter((item) =>
    hasAllowedRole(role, item.allowedRoles)
  )
  const activeUrl = allowedItems
    .filter(
      (item) =>
        pathname === item.url ||
        (item.url !== "/" && pathname.startsWith(`${item.url}/`))
    )
    .sort((firstItem, secondItem) => secondItem.url.length - firstItem.url.length)[0]?.url

  return allowedItems.map((item) => ({
    title: item.title,
    url: item.url,
    icon: item.icon,
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

  if (!user) {
    return null
  }

  return (
    <DashboardLayout
      title={getRouteTitle(location.pathname)}
      homeUrl={getDefaultRoute(user.role)}
      navigationItems={getNavigationItems(location.pathname, user.role)}
      loggingOut={loggingOut}
      onLogout={handleLogout}
      user={{
        name: user.name,
        email: user.email,
        roleLabel: roleLabels[user.role],
        avatar: "",
      }}
    >
      <Outlet />
    </DashboardLayout>
  )
}

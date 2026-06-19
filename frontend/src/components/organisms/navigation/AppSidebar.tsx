import type { ComponentProps, ReactNode } from "react"
import { Link } from "react-router-dom"

import logoIcon from "@/assets/icon.png"

import {
  NavMain,
  type NavItem,
} from "@/components/organisms/navigation/NavMain"
import { NavUser } from "@/components/organisms/navigation/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/atoms/ui/sidebar"

export type SidebarNavigationItem = NavItem & {
  icon: ReactNode
}

export type SidebarUser = {
  name: string
  email: string
  roleLabel: string
  avatar: string
}

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  homeUrl: string
  items: SidebarNavigationItem[]
  loggingOut: boolean
  onLogout: () => Promise<void>
  user: SidebarUser
}

export function AppSidebar({
  homeUrl,
  items,
  loggingOut,
  onLogout,
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to={homeUrl}>
                <img src={logoIcon} alt="KasirKu Logo" className="size-5! object-contain" />
                <span className="text-base font-semibold">KasirKu</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          loggingOut={loggingOut}
          onLogout={onLogout}
          user={user}
        />
      </SidebarFooter>
    </Sidebar>
  )
}

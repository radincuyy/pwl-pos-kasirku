import { NavLink, useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon?: ReactNode
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const location = useLocation()
  const activeItem = items
    .filter(
      (item) =>
        location.pathname === item.url ||
        (item.url !== "/" && location.pathname.startsWith(`${item.url}/`))
    )
    .sort((firstItem, secondItem) => secondItem.url.length - firstItem.url.length)[0]

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = activeItem?.url === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <NavLink to={item.url} end={item.url === "/"}>
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

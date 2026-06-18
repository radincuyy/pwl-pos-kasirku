import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/atoms/ui/sidebar"

export type NavItem = {
  title: string
  url: string
  icon?: ReactNode
  isActive: boolean
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
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

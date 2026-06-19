"use client"

import type { CSSProperties, ReactNode } from "react"
import {
  AppSidebar,
  type SidebarNavigationItem,
  type SidebarUser,
} from "@/components/organisms/navigation/AppSidebar"
import { SiteHeader } from "@/components/organisms/navigation/SiteHeader"
import { SidebarInset, SidebarProvider } from "@/components/atoms/ui/sidebar"
import { TooltipProvider } from "@/components/atoms/ui/tooltip"

type DashboardLayoutProps = {
  children: ReactNode
  homeUrl: string
  title: string
  navigationItems: SidebarNavigationItem[]
  loggingOut: boolean
  onLogout: () => Promise<void>
  user: SidebarUser
}

export default function DashboardLayout({
  children,
  homeUrl,
  title,
  navigationItems,
  loggingOut,
  onLogout,
  user,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <TooltipProvider>
        <AppSidebar
          variant="inset"
          homeUrl={homeUrl}
          items={navigationItems}
          loggingOut={loggingOut}
          onLogout={onLogout}
          user={user}
        />
        <SidebarInset>
          <SiteHeader title={title} />
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  )
}

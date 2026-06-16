"use client"

import * as React from "react"
import { Outlet } from "react-router-dom"
import { useAppSelector } from "@/store"
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"
import { Button } from "@/components/ui/button"

export default function DashboardLayout() {
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    // Placeholder handler per AGENT.md — actual logout implemented in later task
    console.log("logout placeholder")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">POS - Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm">Halo, {user?.name ?? "Pengguna"}</div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        {/* Body: Sidebar + Content */}
        <div className="flex flex-1 min-h-0">
          <Sidebar className="w-64" collapsible="icon">
            <AppSidebar />
          </Sidebar>

          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

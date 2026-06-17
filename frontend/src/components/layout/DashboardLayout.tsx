"use client"

import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import AppSidebar from "./AppSidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAppDispatch, useAppSelector } from "@/store"
import { localLogout, logoutUser } from "@/store/authSlice"

export default function DashboardLayout() {
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U"

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">POS - Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-muted-foreground">
              Halo, {user?.name ?? "Pengguna"}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-1">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <div className="px-3 py-2 text-xs text-muted-foreground">{user?.email}</div>
                <DropdownMenuItem onSelect={handleLogout} data-variant="destructive">
                  {loggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

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

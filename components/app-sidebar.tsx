"use client"

import * as React from "react"
import { LayoutDashboard, Target, Users, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Menu items with icons
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Long-term Goals",
    icon: Target,
    href: "/long-term-goals",
  },
  {
    title: "Agents",
    icon: Users,
    href: "/agents",
  },
]

// Mock users for the dropdown
const mockUsers = [
  { id: "1", name: "Scott Anderson", email: "scott@example.com", avatar: null },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", avatar: null },
  { id: "3", name: "Mike Davis", email: "mike@example.com", avatar: null },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const [selectedUser, setSelectedUser] = React.useState(mockUsers[0])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarContent className="pt-4">
        <div className={state === "expanded" ? "px-3 pb-4" : "flex justify-center pb-4"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={
                  state === "expanded"
                    ? "flex w-full items-center gap-3 rounded-lg bg-white border border-gray-200 px-3 py-2.5 hover:bg-gray-50 transition-colors shadow-sm"
                    : "flex items-center justify-center"
                }
              >
                <Avatar className="size-8">
                  <AvatarImage src={selectedUser.avatar || undefined} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <>
                    <div className="flex flex-1 flex-col items-start text-left">
                      <span className="text-sm font-semibold text-gray-900">{selectedUser.name}</span>
                    </div>
                    <ChevronDown className="size-4 text-gray-400" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white">
              {mockUsers.map((mockUser) => (
                <DropdownMenuItem
                  key={mockUser.id}
                  onClick={() => setSelectedUser(mockUser)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="size-6">
                    <AvatarImage src={mockUser.avatar || undefined} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                      {getInitials(mockUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{mockUser.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Menu */}
        <SidebarMenu className="px-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="w-full justify-start" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

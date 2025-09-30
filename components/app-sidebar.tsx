"use client"

import * as React from "react"
import { LayoutDashboard, Target, Users, ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"

// Menu items with icons
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Long-term Goals",
    icon: Target,
    isActive: false,
  },
  {
    title: "Agents",
    icon: Users,
    isActive: false,
  },
]

// Mock users for the dropdown - in a real app, this would come from your database
const mockUsers = [
  { id: "1", name: "Scott Anderson", email: "scott@example.com", avatar: null },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", avatar: null },
  { id: "3", name: "Mike Davis", email: "mike@example.com", avatar: null },
]

export function AppSidebar() {
  const { user } = useAuth()
  const { state } = useSidebar()
  const [selectedUser, setSelectedUser] = React.useState(mockUsers[0])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Target className="size-4" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Goal Tracker</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-2 py-4">
          {/* User Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-sidebar-accent transition-colors">
                <Avatar className="size-8">
                  <AvatarImage src={selectedUser.avatar || undefined} />
                  <AvatarFallback className="bg-muted text-xs">{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <>
                    <div className="flex flex-1 flex-col items-start text-left">
                      <span className="text-sm font-medium">{selectedUser.name}</span>
                      <span className="text-xs text-muted-foreground">{selectedUser.email}</span>
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {mockUsers.map((mockUser) => (
                <DropdownMenuItem
                  key={mockUser.id}
                  onClick={() => setSelectedUser(mockUser)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="size-6">
                    <AvatarImage src={mockUser.avatar || undefined} />
                    <AvatarFallback className="bg-muted text-xs">{getInitials(mockUser.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{mockUser.name}</span>
                    <span className="text-xs text-muted-foreground">{mockUser.email}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Menu */}
        <SidebarMenu className="px-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-sidebar-accent transition-colors">
                <Avatar className="size-8">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-muted text-xs">
                    {user.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <>
                    <div className="flex flex-1 flex-col items-start text-left">
                      <span className="text-sm font-medium">{user.name || "User"}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <SignOutButton className="w-full cursor-pointer" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

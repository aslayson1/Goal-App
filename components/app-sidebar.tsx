"use client"

import * as React from "react"
import { LayoutDashboard, Target, Users, Dumbbell } from "lucide-react"
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

const menuItems = [
  { title: "Overview", icon: LayoutDashboard, href: "/" },
  { title: "Long-Term Goals", icon: Target, href: "/long-term-goals" },
  { title: "Agents", icon: Users, href: "/agents" },
  { title: "Fitness", icon: Dumbbell, href: "/fitness" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-[#e3e8ee] bg-white" collapsible="icon">
      <SidebarContent className="pt-5">
        <div className={state === "expanded" ? "px-5 pb-5" : "px-2 pb-5"}>
          {state === "expanded" ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#078b90]">Planning</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#142b43]">Goal Tracker</h2>
              <p className="mt-1 text-xs text-[#657487]">Make progress that matters.</p>
            </>
          ) : (
            <Target className="mx-auto size-5 text-[#078b90]" aria-label="Goal Tracker" />
          )}
        </div>
        <SidebarMenu className="px-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className="rounded-lg text-[#526276] data-[active=true]:bg-[#e9f6f5] data-[active=true]:text-[#076f75]"
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#e3e8ee] py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="w-full justify-start" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

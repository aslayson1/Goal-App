"use client"

import * as React from "react"
import { LayoutDashboard, Target, Users, ChevronDown } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase/client"

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

// Agent interface
interface Agent {
  id: string
  name: string
  role: string
  avatar?: string | null
}

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null)
  const [isOwner, setIsOwner] = React.useState(false)

  React.useEffect(() => {
    const loadAgents = async () => {
      if (!user?.id) {
        const fallbackAgent: Agent = {
          id: "loading",
          name: "Loading...",
          role: "User",
        }
        setAgents([fallbackAgent])
        setSelectedAgent(fallbackAgent)
        return
      }

      try {
        const { data: allTeamAgents, error: agentsError } = await supabase
          .from("agents")
          .select("id, name, role, user_id")
          .eq("user_id", user.id)
          .order("name", { ascending: true })

        if (agentsError) throw agentsError

        console.log("[v0] Loaded agents from database:", allTeamAgents)

        const currentUserAgent = allTeamAgents?.find((agent) => agent.name === user.name) || allTeamAgents?.[0]
        const userIsOwner = currentUserAgent?.role === "Owner"

        console.log("[v0] Current user agent:", currentUserAgent)
        console.log("[v0] Is owner:", userIsOwner)

        setIsOwner(userIsOwner)

        const agentsList: Agent[] = (allTeamAgents || []).map((agent) => ({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          avatar: agent.name === user.name ? user.avatar : undefined,
        }))

        console.log("[v0] Final agents list:", agentsList)

        if (agentsList.length === 0) {
          const fallbackAgent: Agent = {
            id: user.id,
            name: user.name || "My Dashboard",
            role: "Owner",
            avatar: user.avatar,
          }
          setAgents([fallbackAgent])
          setSelectedAgent(fallbackAgent)
        } else {
          setAgents(agentsList)

          const agentIdFromUrl = searchParams.get("agentId")
          const agentToSelect = agentIdFromUrl
            ? agentsList.find((a) => a.id === agentIdFromUrl) || agentsList[0]
            : agentsList.find((a) => a.name === user.name) || agentsList[0]

          console.log("[v0] Selected agent:", agentToSelect)
          setSelectedAgent(agentToSelect)
        }
      } catch (error) {
        console.error("[v0] Error loading agents:", error)
        const fallbackAgent: Agent = {
          id: user.id,
          name: user.name || "My Dashboard",
          role: "Owner",
          avatar: user.avatar,
        }
        setAgents([fallbackAgent])
        setSelectedAgent(fallbackAgent)
      }
    }

    loadAgents()
  }, [user?.id, user?.name, user?.avatar, searchParams])

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent)
    const params = new URLSearchParams(searchParams.toString())

    const currentUserAgent = agents.find((a) => a.name === user?.name)

    if (agent.id === currentUserAgent?.id) {
      params.delete("agentId")
    } else {
      params.set("agentId", agent.id)
    }
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname
    router.push(newUrl)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const displayAgent = selectedAgent || {
    id: "default",
    name: "Dashboard",
    role: "User",
  }

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarContent className="pt-4">
        <div className={state === "expanded" ? "px-3 pb-4" : "flex justify-center pb-4"}>
          {isOwner && agents.length > 1 ? (
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
                    <AvatarImage src={displayAgent.avatar || undefined} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
                      {getInitials(displayAgent.name)}
                    </AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <>
                      <div className="flex flex-1 flex-col items-start text-left">
                        <span className="text-sm font-semibold text-gray-900">{displayAgent.name}</span>
                        <span className="text-xs text-gray-500">{displayAgent.role}</span>
                      </div>
                      <ChevronDown className="size-4 text-gray-400" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white">
                {agents.map((agent) => (
                  <DropdownMenuItem
                    key={agent.id}
                    onClick={() => handleAgentSelect(agent)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Avatar className="size-6">
                      <AvatarImage src={agent.avatar || undefined} />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                        {getInitials(agent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-xs text-gray-500">{agent.role}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div
              className={
                state === "expanded"
                  ? "flex w-full items-center gap-3 rounded-lg bg-white border border-gray-200 px-3 py-2.5 shadow-sm"
                  : "flex items-center justify-center"
              }
            >
              <Avatar className="size-8">
                <AvatarImage src={displayAgent.avatar || undefined} />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
                  {getInitials(displayAgent.name)}
                </AvatarFallback>
              </Avatar>
              {state === "expanded" && (
                <div className="flex flex-1 flex-col items-start text-left">
                  <span className="text-sm font-semibold text-gray-900">{displayAgent.name}</span>
                  <span className="text-xs text-gray-500">{displayAgent.role}</span>
                </div>
              )}
            </div>
          )}
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

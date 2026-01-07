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

  const hasLoadedAgents = React.useRef(false)

  React.useEffect(() => {
    const loadAgents = async () => {
      if (!user?.id || hasLoadedAgents.current) return

      hasLoadedAgents.current = true

      try {
        const { data: userAsAgent, error: userAgentError } = await supabase
          .from("agents")
          .select("id, name, role, user_id")
          .eq("name", user.name)
          .maybeSingle()

        if (userAgentError && userAgentError.code !== "PGRST116") {
          console.error("[v0] Error checking if user is agent:", userAgentError)
        }

        // If the user is an agent (not an owner), show only their profile
        if (userAsAgent && userAsAgent.role !== "Owner") {
          const agentProfile: Agent = {
            id: userAsAgent.id,
            name: userAsAgent.name,
            role: userAsAgent.role,
            avatar: user.avatar,
          }
          setAgents([agentProfile])
          setSelectedAgent(agentProfile)
          setIsOwner(false)
          return
        }

        const { data: allTeamAgents, error: agentsError } = await supabase
          .from("agents")
          .select("id, name, role, user_id")
          .eq("user_id", user.id)
          .order("name", { ascending: true })

        if (agentsError) throw agentsError

        const currentUserAgent = allTeamAgents?.find((agent) => agent.name === user.name) || allTeamAgents?.[0]
        const userIsOwner = currentUserAgent?.role === "Owner"

        setIsOwner(userIsOwner)

        const agentsList: Agent[] = (allTeamAgents || []).map((agent) => ({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          avatar: agent.name === user.name ? user.avatar : undefined,
        }))

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

          // Set initial selected agent based on URL or default to current user
          const agentIdFromUrl = searchParams.get("agentId")
          const agentToSelect = agentIdFromUrl
            ? agentsList.find((a) => a.id === agentIdFromUrl) || agentsList[0]
            : agentsList.find((a) => a.name === user.name) || agentsList[0]

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
  }, [user?.id, user?.name, user?.avatar]) // Removed searchParams from dependencies

  React.useEffect(() => {
    if (agents.length === 0 || !user?.name) return

    const agentIdFromUrl = searchParams.get("agentId")
    if (agentIdFromUrl) {
      const agentFromUrl = agents.find((a) => a.id === agentIdFromUrl)
      if (agentFromUrl && agentFromUrl.id !== selectedAgent?.id) {
        setSelectedAgent(agentFromUrl)
      }
    } else {
      // No agentId in URL, select current user's agent
      const currentUserAgent = agents.find((a) => a.name === user.name)
      if (currentUserAgent && currentUserAgent.id !== selectedAgent?.id) {
        setSelectedAgent(currentUserAgent)
      }
    }
  }, [searchParams, agents, user?.name]) // Separate URL sync effect

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

  const buildHrefWithAgent = (basePath: string) => {
    const agentId = searchParams.get("agentId")
    if (agentId) {
      return `${basePath}?agentId=${agentId}`
    }
    return basePath
  }

  return (
    <Sidebar className="border-r bg-white" collapsible="icon">
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
          {menuItems
            .filter((item) => item.title !== "Agents" || isOwner)
            .map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={buildHrefWithAgent(item.href)}>
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

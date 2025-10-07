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
import { createClient } from "@/lib/supabase/client"

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
  const supabase = createClient()

  React.useEffect(() => {
    const loadAgents = async () => {
      if (!user?.id) return

      try {
        const { data: currentUserAgent, error: currentUserError } = await supabase
          .from("agents")
          .select("id, name, role")
          .eq("user_id", user.id)
          .maybeSingle()

        if (currentUserError) throw currentUserError

        const isOwner = currentUserAgent?.role === "Owner"

        let agentsList: Agent[] = []

        if (isOwner) {
          const { data: teamAgents, error: teamError } = await supabase
            .from("agents")
            .select("id, name, role, user_id")
            .eq("user_id", user.id)
            .order("name", { ascending: true })

          if (teamError) throw teamError
          agentsList = teamAgents || []
        }

        const currentAgent: Agent = {
          id: user.id,
          name: currentUserAgent?.name || user.name || "My Dashboard",
          role: currentUserAgent?.role || "Owner",
          avatar: user.avatar,
        }

        const allAgents = [currentAgent, ...agentsList]
        setAgents(allAgents)

        const agentIdFromUrl = searchParams.get("agentId")
        const agentToSelect = agentIdFromUrl
          ? allAgents.find((a) => a.id === agentIdFromUrl) || currentAgent
          : currentAgent

        setSelectedAgent(agentToSelect)
      } catch (error) {
        console.error("Error loading agents:", error)
        const currentAgent: Agent = {
          id: user.id,
          name: user.name || "My Dashboard",
          role: "Owner",
          avatar: user.avatar,
        }
        setAgents([currentAgent])
        setSelectedAgent(currentAgent)
      }
    }

    loadAgents()
  }, [user?.id, searchParams])

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent)
    const params = new URLSearchParams(searchParams.toString())
    if (agent.id === user?.id) {
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

  if (!selectedAgent) {
    return null
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
                  <AvatarImage src={selectedAgent.avatar || undefined} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
                    {getInitials(selectedAgent.name)}
                  </AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <>
                    <div className="flex flex-1 flex-col items-start text-left">
                      <span className="text-sm font-semibold text-gray-900">{selectedAgent.name}</span>
                      <span className="text-xs text-gray-500">{selectedAgent.role}</span>
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

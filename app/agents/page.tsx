"use client"

import { useState, useEffect } from "react"
import { Plus, Users, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { updateAgentAuthUser, createAgentWithAuth, syncAgentName } from "./actions" // Import server action
import { createClient } from "@supabase/supabase-js" // Import createClient for Supabase
import { supabase } from "@/lib/supabase/client"

interface Agent {
  id: string
  user_id: string
  name: string
  role: string
  description: string
  email: string
  created_at: string
  updated_at: string
  auth_user_id?: string
  profiles?: {
    avatar_url: string | null
  }
}

function getInitials(name?: string | null): string {
  if (!name || typeof name !== "string") return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function AgentsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [showDeleteAgent, setShowDeleteAgent] = useState<{ id: string; name: string } | null>(null)
  const [newAgent, setNewAgent] = useState({
    name: "",
    role: "",
    description: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch agents from Supabase
  useEffect(() => {
    // If user is loaded, fetch agents
    if (user?.id) {
      fetchAgents()
    } else if (!authLoading && !user) {
      // Auth is done loading and no user is logged in
      setIsLoading(false)
    }
    
    // Timeout fallback - if auth is stuck loading after 5 seconds, try anyway
    const timeout = setTimeout(() => {
      if (isLoading && !user) {
        setIsLoading(false)
      }
    }, 5000)
    
    return () => clearTimeout(timeout)
  }, [user, authLoading])

  const fetchAgents = async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      // Fetch agents
      const { data: agentsData, error: agentsError } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (agentsError) throw agentsError

      // Get all unique auth_user_ids
      const authUserIds = agentsData
        ?.map(agent => agent.auth_user_id)
        .filter((id): id is string => !!id) || []

      // Fetch profiles for those auth_user_ids
      let profilesMap: Record<string, { avatar_url: string | null }> = {}
      if (authUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, avatar_url")
          .in("id", authUserIds)

        if (profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = { avatar_url: profile.avatar_url }
            return acc
          }, {} as Record<string, { avatar_url: string | null }>)
        }
      }

      // Merge profiles into agents
      const agentsWithProfiles = agentsData?.map(agent => ({
        ...agent,
        profiles: agent.auth_user_id ? profilesMap[agent.auth_user_id] : undefined
      })) || []

      setAgents(agentsWithProfiles)
    } catch (error) {
      console.error("Error fetching agents:", error)
      setAgents([])
    } finally {
      setIsLoading(false)
    }
  }

  const addAgent = async () => {
    if (!newAgent.name || !newAgent.role || !newAgent.email || !newAgent.password || !user?.id) return

    try {
      setIsSaving(true)

      const result = await createAgentWithAuth(
        user.id,
        newAgent.name,
        newAgent.role,
        newAgent.description,
        newAgent.email,
        newAgent.password,
      )

      if (!result.success) {
        throw new Error(result.error || "Failed to create agent")
      }

      setAgents((prev) => [result.agent, ...prev])
      setNewAgent({ name: "", role: "", description: "", email: "", password: "" })
      setShowAddAgent(false)

      alert("Agent created successfully! They can now log in with their email and password.")
    } catch (error: any) {
      console.error("Error adding agent:", error)
      alert(`Failed to create agent: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const startEditingAgent = (agent: Agent) => {
    setEditingAgent(agent)
    setNewAgent({
      name: agent.name,
      role: agent.role,
      description: agent.description,
      email: agent.email || "",
      password: "", // Don't pre-fill password for security
    })
    setShowAddAgent(true)
  }

  const saveEditedAgent = async () => {
    if (!editingAgent || !newAgent.name || !newAgent.role) return

    try {
      setIsSaving(true)

      console.log("[v0] Saving agent:", {
        id: editingAgent.id,
        name: newAgent.name,
        email: newAgent.email,
        hasPassword: !!newAgent.password,
        hasAuthUserId: !!editingAgent.auth_user_id,
      })

      if (editingAgent.auth_user_id) {
        const syncResult = await syncAgentName(editingAgent.auth_user_id, newAgent.name)
        if (!syncResult.success) {
          console.error("[v0] Failed to sync name:", syncResult.error)
        } else {
          console.log("[v0] Agent name synced to auth metadata")
        }
      }

      if (newAgent.email && (newAgent.password || !editingAgent.auth_user_id)) {
        const result = await updateAgentAuthUser(
          editingAgent.id,
          newAgent.name,
          editingAgent.auth_user_id || null,
          newAgent.email,
          newAgent.password || undefined,
        )

        if (!result.success) {
          throw new Error(result.error || "Failed to update auth user")
        }

        console.log("[v0] Auth user updated successfully")
      }

      console.log("[v0] Updating agent record (without email field due to schema cache)")
      const updatePayload: any = {
        name: newAgent.name,
        role: newAgent.role,
        description: newAgent.description,
        updated_at: new Date().toISOString(),
      }

      const { data: updatedAgent, error: updateError } = await supabase
        .from("agents")
        .update(updatePayload)
        .eq("id", editingAgent.id)
        .select()
        .single()

      if (updateError) {
        console.error("[v0] Database update error:", updateError.message)
        throw updateError
      }

      console.log("[v0] Agent updated successfully:", updatedAgent)
      setAgents((prev) => prev.map((a) => (a.id === editingAgent.id ? updatedAgent : a)))

      setNewAgent({ name: "", role: "", description: "", email: "", password: "" })
      setEditingAgent(null)
      setShowAddAgent(false)

      alert("Agent updated successfully! They can now log in with their email and password.")
    } catch (error: any) {
      console.error("[v0] Error updating agent:", error)
      alert(`Failed to update agent: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const deleteAgent = async (id: string) => {
    try {
      const { error } = await supabase.from("agents").delete().eq("id", id)

      if (error) throw error

      setAgents((prev) => prev.filter((a) => a.id !== id))
      setShowDeleteAgent(null)
    } catch (error) {
      console.error("Error deleting agent:", error)
    }
  }

  const handleDialogClose = () => {
    setShowAddAgent(false)
    setEditingAgent(null)
    setNewAgent({ name: "", role: "", description: "", email: "", password: "" })
  }

  return (
    <div className="space-y-6 px-3 md:px-6 lg:px-12 pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Team</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your team members and their roles</p>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowAddAgent(true)}
                  className="text-sm bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Agent
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500">Loading agents...</p>
                </div>
              ) : agents.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents yet</h3>
                    <p className="text-sm text-gray-600 mb-4">Get started by adding your first team member</p>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowAddAgent(true)}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Agent
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12 border-2 border-gray-200">
                              {agent.profiles?.avatar_url && (
                                <AvatarImage src={agent.profiles.avatar_url} alt={agent.name} />
                              )}
                              <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                                {getInitials(agent.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm lg:text-base font-semibold line-clamp-2">{agent.name}</CardTitle>
                              <CardDescription className="text-xs lg:text-sm">{agent.role}</CardDescription>
                              {agent.email && <p className="text-xs text-gray-500 mt-1 truncate">{agent.email}</p>}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => startEditingAgent(agent)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Agent
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setShowDeleteAgent({ id: agent.id, name: agent.name })}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Agent
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      {agent.description && (
                        <CardContent>
                          <p className="text-sm text-gray-600">{agent.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}

      {/* Add/Edit Agent Dialog */}
      <Dialog open={showAddAgent} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
            <DialogDescription>
              {editingAgent
                ? "Update the agent's information and login credentials"
                : "Add a new team member with login credentials"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="agent-name">Name</Label>
              <Input
                id="agent-name"
                placeholder="e.g., John Smith"
                value={newAgent.name}
                onChange={(e) => setNewAgent((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="agent-role">Role</Label>
              <Select
                value={newAgent.role}
                onValueChange={(value) => setNewAgent((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="agent-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agent-email">Email (Login Username)</Label>
              <Input
                id="agent-email"
                type="email"
                placeholder="agent@example.com"
                value={newAgent.email}
                onChange={(e) => setNewAgent((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="agent-password">Password {editingAgent && "(Leave blank to keep current)"}</Label>
              <Input
                id="agent-password"
                type="password"
                placeholder={editingAgent ? "Enter new password to change" : "Create a secure password"}
                value={newAgent.password}
                onChange={(e) => setNewAgent((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="agent-description">Description (Optional)</Label>
              <Textarea
                id="agent-description"
                placeholder="Brief description of responsibilities or expertise..."
                value={newAgent.description}
                onChange={(e) => setNewAgent((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={editingAgent ? saveEditedAgent : addAgent}
              disabled={
                !newAgent.name || !newAgent.role || !newAgent.email || (!editingAgent && !newAgent.password) || isSaving
              }
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isSaving ? "Saving..." : editingAgent ? "Save Changes" : "Add Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteAgent} onOpenChange={() => setShowDeleteAgent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{showDeleteAgent?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteAgent(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDeleteAgent) {
                  deleteAgent(showDeleteAgent.id)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

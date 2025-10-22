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
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { supabase } from "@/lib/supabase/client"
import { updateAgentAuthUser, createAgentWithAuth, syncAgentName } from "./actions" // Import server action

interface Agent {
  id: string
  user_id: string
  name: string
  role: string
  description: string
  created_at: string
  updated_at: string
  email: string
  auth_user_id: string
}

export default function AgentsPage() {
  const { user, isLoading: authLoading } = useAuth()
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

  const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== "string") return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Fetch agents from Supabase
  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchAgents()
    } else if (!authLoading && !user) {
      setIsLoading(false)
    }
  }, [user, authLoading])

  const fetchAgents = async () => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error("Error fetching agents:", error)
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/layson-group-logo.png"
              alt="Layson Group"
              width={180}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border-2 border-black">
                  {user?.avatar && (
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40&text=U"} alt={user?.name} />
                  )}
                  <AvatarFallback className="bg-white text-black text-xs font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <SignOutButton className="w-full text-left" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <div className="flex flex-1 flex-col gap-4 py-4 md:py-6 px-4 md:px-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12 border-2 border-gray-200">
                              <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                                {getInitials(agent.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{agent.name}</CardTitle>
                              <CardDescription className="text-sm">{agent.role}</CardDescription>
                              {agent.email && <p className="text-xs text-gray-500 mt-1">{agent.email}</p>}
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
            </div>
          </SidebarInset>
        </div>
      </div>

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
    </SidebarProvider>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Plus, Target, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"

type Milestone = {
  id: string
  title: string
  completed: boolean
  targetDate: string
}

type LongTermGoal = {
  id: string
  title: string
  description: string
  targetDate: string
  category: string
  status: "in-progress" | "completed" | "on-hold"
  notes: string
  milestones: Milestone[]
}

type LongTermGoals = {
  "1-year": {
    [category: string]: LongTermGoal[]
  }
  "5-year": {
    [category: string]: LongTermGoal[]
  }
}

export default function LongTermGoalsPage() {
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoals>({
    "1-year": {
      Business: [],
      Personal: [],
      Financial: [],
    },
    "5-year": {
      Business: [],
      Personal: [],
      Financial: [],
    },
  })
  const [showAddLongTermGoal, setShowAddLongTermGoal] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1-year" | "5-year">("1-year")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [newLongTermGoal, setNewLongTermGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "",
    notes: "",
    milestones: [
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
    ],
  })
  const [showDeleteLongTermGoal, setShowDeleteLongTermGoal] = useState<{
    timeframe: "1-year" | "5-year"
    category: string
    goalId: string
    title: string
  } | null>(null)
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("long_term_goals")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform database goals into the structure expected by the UI
      const transformed: LongTermGoals = {
        "1-year": {
          Business: [],
          Personal: [],
          Financial: [],
        },
        "5-year": {
          Business: [],
          Personal: [],
          Financial: [],
        },
      }

      data?.forEach((goal) => {
        const timeframe = goal.goal_type === "1_year" ? "1-year" : "5-year"
        const category = goal.category || "Personal"

        if (!transformed[timeframe][category]) {
          transformed[timeframe][category] = []
        }

        transformed[timeframe][category].push({
          id: goal.id,
          title: goal.title,
          description: goal.description || "",
          targetDate: goal.target_date || "",
          category: category,
          status: goal.completed ? "completed" : "in-progress",
          notes: goal.notes || "",
          milestones: goal.milestones || [],
        })
      })

      setLongTermGoals(transformed)
    } catch (error) {
      console.error("Error loading goals:", error)
    }
  }

  const addLongTermGoal = async () => {
    if (!newLongTermGoal.title) return

    try {
      const goalType = selectedTimeframe === "1-year" ? "1_year" : "5_year"

      const { data, error } = await supabase
        .from("long_term_goals")
        .insert([
          {
            title: newLongTermGoal.title,
            description: newLongTermGoal.description,
            goal_type: goalType,
            category: newLongTermGoal.category,
            target_date: newLongTermGoal.targetDate,
            notes: newLongTermGoal.notes,
            completed: false,
            milestones: (newLongTermGoal.milestones || [])
              .filter((m) => m.title && m.targetDate)
              .map((m, index) => ({
                id: `temp_m${index + 1}`,
                title: m.title,
                completed: false,
                targetDate: m.targetDate,
              })),
          },
        ])
        .select()

      if (error) throw error

      await loadGoals()

      setNewLongTermGoal({
        title: "",
        description: "",
        targetDate: "",
        category: "",
        notes: "",
        milestones: [
          { title: "", targetDate: "" },
          { title: "", targetDate: "" },
          { title: "", targetDate: "" },
          { title: "", targetDate: "" },
        ],
      })
      setShowAddLongTermGoal(false)

      toast({
        title: "Success",
        description: "Goal added successfully",
      })
    } catch (error) {
      console.error("Error adding long-term goal:", error)
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      })
    }
  }

  const deleteLongTermGoal = async (timeframe: "1-year" | "5-year", category: string, goalId: string) => {
    try {
      const { error } = await supabase.from("long_term_goals").delete().eq("id", goalId)

      if (error) throw error

      await loadGoals()

      toast({
        title: "Success",
        description: "Goal deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting goal:", error)
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      })
    }

    setShowDeleteLongTermGoal(null)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Business":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Personal":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Financial":
        return "bg-green-50 text-green-700 border-green-200"
      case "Health":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "Education":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const checkboxStyles =
    "data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Target className="size-5 text-primary" />
            <h1 className="text-lg font-semibold">Long-term Goals</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Tabs defaultValue="1-year" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="1-year">1-Year Goals</TabsTrigger>
              <TabsTrigger value="5-year">5-Year Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="1-year" className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">1-Year Goals</h2>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setSelectedTimeframe("1-year")
                    setShowAddLongTermGoal(true)
                  }}
                  className="text-sm bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add 1-Year Goal
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(longTermGoals["1-year"]).map(([category, goals]) => (
                  <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                        >
                          {category}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {goals.length} goal{goals.length !== 1 ? "s" : ""} • Long-term vision
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="p-4 rounded-lg bg-gray-50 border border-border space-y-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={goal.status === "completed"}
                              onCheckedChange={async (checked) => {
                                try {
                                  const { error } = await supabase
                                    .from("long_term_goals")
                                    .update({
                                      completed: !!checked,
                                      completed_at: checked ? new Date().toISOString() : null,
                                    })
                                    .eq("id", goal.id)

                                  if (error) throw error
                                  await loadGoals()
                                } catch (error) {
                                  console.error("Error updating goal:", error)
                                }
                              }}
                              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4
                                    className={`font-semibold mb-2 ${goal.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}
                                  >
                                    {goal.title}
                                  </h4>
                                  <p
                                    className={`text-sm mb-3 ${goal.status === "completed" ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    {goal.description}
                                  </p>
                                  {goal.targetDate && (
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                                      <Badge
                                        variant="secondary"
                                        className={
                                          goal.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : goal.status === "on-hold"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-blue-100 text-blue-800"
                                        }
                                      >
                                        {goal.status.replace("-", " ")}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setShowDeleteLongTermGoal({
                                          timeframe: "1-year",
                                          category,
                                          goalId: goal.id,
                                          title: goal.title,
                                        })
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Goal
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>

                          {/* Milestones */}
                          {goal.milestones && goal.milestones.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">Milestones</h5>
                              <div className="space-y-2">
                                {goal.milestones.map((milestone) => (
                                  <div key={milestone.id} className="flex items-center space-x-3">
                                    <Checkbox
                                      checked={milestone.completed}
                                      onCheckedChange={async (checked) => {
                                        const updatedMilestones = goal.milestones.map((m) =>
                                          m.id === milestone.id ? { ...m, completed: !!checked } : m,
                                        )
                                        try {
                                          const { error } = await supabase
                                            .from("long_term_goals")
                                            .update({ milestones: updatedMilestones })
                                            .eq("id", goal.id)

                                          if (error) throw error
                                          await loadGoals()
                                        } catch (error) {
                                          console.error("Error updating milestone:", error)
                                        }
                                      }}
                                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                                    />
                                    <div className="flex-1">
                                      <span
                                        className={`text-sm ${milestone.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                                      >
                                        {milestone.title}
                                      </span>
                                      {milestone.targetDate && (
                                        <span className="text-xs text-gray-500 ml-2">
                                          {new Date(milestone.targetDate).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {goal.notes && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-sm text-gray-600">{goal.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="5-year" className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">5-Year Goals</h2>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setSelectedTimeframe("5-year")
                    setShowAddLongTermGoal(true)
                  }}
                  className="text-sm bg-black hover:bg-gray-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add 5-Year Goal
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(longTermGoals["5-year"]).map(([category, goals]) => (
                  <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                        >
                          {category}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {goals.length} goal{goals.length !== 1 ? "s" : ""} • Long-term vision
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="p-4 rounded-lg bg-gray-50 border border-border space-y-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={goal.status === "completed"}
                              onCheckedChange={async (checked) => {
                                try {
                                  const { error } = await supabase
                                    .from("long_term_goals")
                                    .update({
                                      completed: !!checked,
                                      completed_at: checked ? new Date().toISOString() : null,
                                    })
                                    .eq("id", goal.id)

                                  if (error) throw error
                                  await loadGoals()
                                } catch (error) {
                                  console.error("Error updating goal:", error)
                                }
                              }}
                              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4
                                    className={`font-semibold mb-2 ${goal.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}
                                  >
                                    {goal.title}
                                  </h4>
                                  <p
                                    className={`text-sm mb-3 ${goal.status === "completed" ? "text-gray-400" : "text-gray-600"}`}
                                  >
                                    {goal.description}
                                  </p>
                                  {goal.targetDate && (
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                                      <Badge
                                        variant="secondary"
                                        className={
                                          goal.status === "completed"
                                            ? "bg-green-100 text-green-800"
                                            : goal.status === "on-hold"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-blue-100 text-blue-800"
                                        }
                                      >
                                        {goal.status.replace("-", " ")}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setShowDeleteLongTermGoal({
                                          timeframe: "5-year",
                                          category,
                                          goalId: goal.id,
                                          title: goal.title,
                                        })
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Goal
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>

                          {/* Milestones */}
                          {goal.milestones && goal.milestones.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">Milestones</h5>
                              <div className="space-y-2">
                                {goal.milestones.map((milestone) => (
                                  <div key={milestone.id} className="flex items-center space-x-3">
                                    <Checkbox
                                      checked={milestone.completed}
                                      onCheckedChange={async (checked) => {
                                        const updatedMilestones = goal.milestones.map((m) =>
                                          m.id === milestone.id ? { ...m, completed: !!checked } : m,
                                        )
                                        try {
                                          const { error } = await supabase
                                            .from("long_term_goals")
                                            .update({ milestones: updatedMilestones })
                                            .eq("id", goal.id)

                                          if (error) throw error
                                          await loadGoals()
                                        } catch (error) {
                                          console.error("Error updating milestone:", error)
                                        }
                                      }}
                                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                                    />
                                    <div className="flex-1">
                                      <span
                                        className={`text-sm ${milestone.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                                      >
                                        {milestone.title}
                                      </span>
                                      {milestone.targetDate && (
                                        <span className="text-xs text-gray-500 ml-2">
                                          {new Date(milestone.targetDate).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {goal.notes && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-sm text-gray-600">{goal.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>

      <Dialog open={showAddLongTermGoal} onOpenChange={setShowAddLongTermGoal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add {selectedTimeframe === "1-year" ? "1-Year" : "5-Year"} Goal</DialogTitle>
            <DialogDescription>Create a new long-term goal with milestones</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lt-goal-title">Goal Title</Label>
              <Input
                id="lt-goal-title"
                placeholder="e.g., Launch successful startup, Complete marathon"
                value={newLongTermGoal.title}
                onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lt-goal-description">Description</Label>
              <Textarea
                id="lt-goal-description"
                placeholder="Describe your long-term vision..."
                value={newLongTermGoal.description}
                onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lt-target-date">Target Date</Label>
                <Input
                  id="lt-target-date"
                  type="date"
                  value={newLongTermGoal.targetDate}
                  onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lt-category">Category</Label>
                <Select
                  value={newLongTermGoal.category}
                  onValueChange={(value) => setNewLongTermGoal((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="lt-notes">Notes</Label>
              <Textarea
                id="lt-notes"
                placeholder="Additional notes or strategy..."
                value={newLongTermGoal.notes}
                onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div>
              <Label>Milestones (Optional)</Label>
              <div className="space-y-3 mt-2">
                {newLongTermGoal.milestones.map((milestone, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder={`Milestone ${index + 1} title`}
                      value={milestone.title}
                      onChange={(e) => {
                        const updatedMilestones = [...newLongTermGoal.milestones]
                        updatedMilestones[index] = { ...updatedMilestones[index], title: e.target.value }
                        setNewLongTermGoal((prev) => ({ ...prev, milestones: updatedMilestones }))
                      }}
                    />
                    <Input
                      type="date"
                      value={milestone.targetDate}
                      onChange={(e) => {
                        const updatedMilestones = [...newLongTermGoal.milestones]
                        updatedMilestones[index] = { ...updatedMilestones[index], targetDate: e.target.value }
                        setNewLongTermGoal((prev) => ({ ...prev, milestones: updatedMilestones }))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLongTermGoal(false)}>
              Cancel
            </Button>
            <Button onClick={addLongTermGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showDeleteLongTermGoal} onOpenChange={() => setShowDeleteLongTermGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{showDeleteLongTermGoal?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteLongTermGoal(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDeleteLongTermGoal) {
                  deleteLongTermGoal(
                    showDeleteLongTermGoal.timeframe,
                    showDeleteLongTermGoal.category,
                    showDeleteLongTermGoal.goalId,
                  )
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Plus, Target, MoreHorizontal, Edit, Trash2, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import {
  getLongTermGoals,
  createLongTermGoal,
  updateLongTermGoal,
  deleteLongTermGoal,
  toggleLongTermGoalCompletion,
  type LongTermGoal,
} from "@/lib/data/long-term-goals"

type GoalTimeframe = "3_year" | "5_year"

interface GoalsByCategory {
  [category: string]: LongTermGoal[]
}

export default function LongTermGoalsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<GoalTimeframe>("3_year")
  const [goals, setGoals] = useState<LongTermGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<LongTermGoal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
  })

  // Category colors matching the dashboard
  const categoryColors: { [key: string]: string } = {
    "Career": "bg-blue-100 text-blue-800 border-blue-200",
    "Health": "bg-green-100 text-green-800 border-green-200",
    "Finance": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Personal": "bg-purple-100 text-purple-800 border-purple-200",
    "Education": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Relationships": "bg-pink-100 text-pink-800 border-pink-200",
    "default": "bg-gray-100 text-gray-800 border-gray-200",
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors["default"]
  }

  // Load goals from database
  useEffect(() => {
    const loadGoals = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const data = await getLongTermGoals()
        setGoals(data)
      } catch (error) {
        console.error("Error loading long-term goals:", error)
      } finally {
        setLoading(false)
      }
    }
    loadGoals()
  }, [user?.id])

  // Filter goals by timeframe and group by category
  const getGoalsByCategory = (timeframe: GoalTimeframe): GoalsByCategory => {
    const filtered = goals.filter((g) => g.goal_type === timeframe)
    const grouped: GoalsByCategory = {}
    
    filtered.forEach((goal) => {
      const category = goal.description?.split("|")[0]?.trim() || "General"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(goal)
    })
    
    return grouped
  }

  const handleAddGoal = async () => {
    if (!newGoal.title || !user?.id) return

    try {
      const goalData = {
        title: newGoal.title,
        description: `${newGoal.category || "General"}|${newGoal.description}`,
        goal_type: activeTab as "3_year" | "5_year",
        completed: false,
        completed_at: null,
        user_id: user.id,
      }

      const created = await createLongTermGoal(goalData)
      if (created) {
        setGoals((prev) => [...prev, created])
        setNewGoal({ title: "", description: "", category: "" })
        setShowAddGoal(false)
      }
    } catch (error) {
      console.error("Error creating goal:", error)
    }
  }

  const handleUpdateGoal = async () => {
    if (!editingGoal) return

    try {
      await updateLongTermGoal(editingGoal.id, {
        title: newGoal.title,
        description: `${newGoal.category || "General"}|${newGoal.description}`,
      })
      
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? { ...g, title: newGoal.title, description: `${newGoal.category || "General"}|${newGoal.description}` }
            : g
        )
      )
      
      setEditingGoal(null)
      setNewGoal({ title: "", description: "", category: "" })
      setShowAddGoal(false)
    } catch (error) {
      console.error("Error updating goal:", error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteLongTermGoal(goalId)
      setGoals((prev) => prev.filter((g) => g.id !== goalId))
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  const handleToggleComplete = async (goal: LongTermGoal) => {
    try {
      await toggleLongTermGoalCompletion(goal.id, !goal.completed)
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goal.id ? { ...g, completed: !g.completed } : g
        )
      )
    } catch (error) {
      console.error("Error toggling goal completion:", error)
    }
  }

  const startEditing = (goal: LongTermGoal) => {
    const parts = goal.description?.split("|") || []
    setEditingGoal(goal)
    setNewGoal({
      title: goal.title,
      category: parts[0] || "General",
      description: parts[1] || "",
    })
    setShowAddGoal(true)
  }

  const getCompletionStats = (timeframe: GoalTimeframe) => {
    const filtered = goals.filter((g) => g.goal_type === timeframe)
    const completed = filtered.filter((g) => g.completed).length
    const total = filtered.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }

  const threeYearStats = getCompletionStats("3_year")
  const fiveYearStats = getCompletionStats("5_year")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">1-Year Goals</h1>
          <p className="text-muted-foreground">Plan and track your 1-year goals</p>
        </div>
        <Button onClick={() => { setEditingGoal(null); setNewGoal({ title: "", description: "", category: "" }); setShowAddGoal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">3-Year Goals</span>
              <span className="text-2xl font-bold">{threeYearStats.completed}/{threeYearStats.total}</span>
            </div>
            <Progress value={threeYearStats.percentage} className="h-2 [&>div]:bg-[#05a7b0]" />
            <p className="text-xs text-muted-foreground mt-2">{threeYearStats.percentage}% complete</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">5-Year Goals</span>
              <span className="text-2xl font-bold">{fiveYearStats.completed}/{fiveYearStats.total}</span>
            </div>
            <Progress value={fiveYearStats.percentage} className="h-2 [&>div]:bg-[#05a7b0]" />
            <p className="text-xs text-muted-foreground mt-2">{fiveYearStats.percentage}% complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for 3-Year and 5-Year Goals */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GoalTimeframe)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="3_year">3-Year Goals</TabsTrigger>
          <TabsTrigger value="5_year">5-Year Goals</TabsTrigger>
        </TabsList>

        {/* 3-Year Goals */}
        <TabsContent value="3_year" className="mt-6">
          {Object.keys(getGoalsByCategory("3_year")).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-muted p-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No 3-year goals yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Start planning your future by adding your first 3-year goal.
                  </p>
                </div>
                <Button onClick={() => { setEditingGoal(null); setNewGoal({ title: "", description: "", category: "" }); setShowAddGoal(true); }} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first goal
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(getGoalsByCategory("3_year")).map(([category, categoryGoals]) => (
                <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}>
                        {category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`flex items-start justify-between p-3 rounded-lg border ${
                          goal.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleComplete(goal)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {goal.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${goal.completed ? "line-through text-gray-500" : ""}`}>
                              {goal.title}
                            </p>
                            {goal.description?.split("|")[1] && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {goal.description.split("|")[1]}
                              </p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditing(goal)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 5-Year Goals */}
        <TabsContent value="5_year" className="mt-6">
          {Object.keys(getGoalsByCategory("5_year")).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-muted p-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No 5-year goals yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Think big and add your first 5-year goal to start planning ahead.
                  </p>
                </div>
                <Button onClick={() => { setEditingGoal(null); setNewGoal({ title: "", description: "", category: "" }); setShowAddGoal(true); }} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first goal
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(getGoalsByCategory("5_year")).map(([category, categoryGoals]) => (
                <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}>
                        {category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`flex items-start justify-between p-3 rounded-lg border ${
                          goal.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleComplete(goal)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {goal.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${goal.completed ? "line-through text-gray-500" : ""}`}>
                              {goal.title}
                            </p>
                            {goal.description?.split("|")[1] && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {goal.description.split("|")[1]}
                              </p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditing(goal)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
            <DialogDescription>
              {editingGoal
                ? "Update your long-term goal details."
                : `Add a new ${activeTab === "3_year" ? "3-year" : "5-year"} goal to track your progress.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Become a senior developer"
                value={newGoal.title}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Career, Health, Finance"
                value={newGoal.category}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details about this goal..."
                value={newGoal.description}
                onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGoal(false)}>
              Cancel
            </Button>
            <Button onClick={editingGoal ? handleUpdateGoal : handleAddGoal}>
              {editingGoal ? "Save Changes" : "Add Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Plus, Target, MoreHorizontal, Edit, Trash2, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth/auth-provider"
import {
  getLongTermGoals,
  createLongTermGoal,
  updateLongTermGoal,
  deleteLongTermGoal,
  toggleLongTermGoalCompletion,
  type LongTermGoal,
} from "@/lib/data/long-term-goals"

interface GoalsByCategory {
  [category: string]: LongTermGoal[]
}

export default function OneYearGoalsPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<LongTermGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingGoal, setEditingGoal] = useState<LongTermGoal | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
  })
  
  const [newCategory, setNewCategory] = useState("")

  // Category colors
  const categoryColors: { [key: string]: string } = {
    "Business": "bg-blue-100 text-blue-800 border-blue-200",
    "Health": "bg-green-100 text-green-800 border-green-200",
    "Finance": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Personal": "bg-purple-100 text-purple-800 border-purple-200",
    "Education": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Career": "bg-orange-100 text-orange-800 border-orange-200",
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
        const data = await getLongTermGoals("1_year")
        setGoals(data)
        // Extract unique categories
        const cats = new Set<string>()
        data.forEach((g) => {
          const cat = g.description?.split("|")[0]?.trim() || "General"
          cats.add(cat)
        })
        setCategories(Array.from(cats).sort())
      } catch (error) {
        console.error("Error loading 1-year goals:", error)
      } finally {
        setLoading(false)
      }
    }
    loadGoals()
  }, [user?.id])

  // Group goals by category
  const getGoalsByCategory = (): GoalsByCategory => {
    const grouped: GoalsByCategory = {}
    goals.forEach((goal) => {
      const category = goal.description?.split("|")[0]?.trim() || "General"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(goal)
    })
    return grouped
  }

  // Calculate completion progress
  const getCompletionProgress = (categoryGoals: LongTermGoal[]): number => {
    if (categoryGoals.length === 0) return 0
    const completed = categoryGoals.filter((g) => g.completed).length
    return Math.round((completed / categoryGoals.length) * 100)
  }

  // Add category
  const addCategory = async () => {
    if (!newCategory.trim()) return
    if (categories.includes(newCategory)) {
      alert("Category already exists")
      return
    }
    setCategories([...categories, newCategory].sort())
    setNewCategory("")
    setShowAddCategory(false)
  }

  // Add goal
  const addGoal = async () => {
    if (!newGoal.title.trim() || !selectedCategory) return
    if (!user?.id) return

    try {
      const description = `${selectedCategory}|${newGoal.description || ""}`
      await createLongTermGoal({
        title: newGoal.title,
        description,
        goal_type: "1_year",
        completed: false,
      })

      setGoals([
        ...goals,
        {
          id: Math.random().toString(),
          title: newGoal.title,
          description,
          goal_type: "1_year",
          completed: false,
          created_at: new Date().toISOString(),
          user_id: user.id,
        },
      ])

      setNewGoal({ title: "", description: "" })
      setShowAddGoal(false)
      setSelectedCategory("")
    } catch (error) {
      console.error("Error creating goal:", error)
    }
  }

  // Update goal
  const updateGoal = async () => {
    if (!editingGoal) return
    try {
      await updateLongTermGoal(editingGoal.id, {
        title: editingGoal.title,
        description: editingGoal.description,
      })
      setGoals(goals.map((g) => (g.id === editingGoal.id ? editingGoal : g)))
      setEditingGoal(null)
    } catch (error) {
      console.error("Error updating goal:", error)
    }
  }

  // Toggle completion
  const toggleCompletion = async (goal: LongTermGoal) => {
    try {
      await toggleLongTermGoalCompletion(goal.id)
      setGoals(
        goals.map((g) =>
          g.id === goal.id ? { ...g, completed: !g.completed } : g
        )
      )
    } catch (error) {
      console.error("Error toggling completion:", error)
    }
  }

  // Delete goal
  const deleteGoal = async (goalId: string) => {
    try {
      await deleteLongTermGoal(goalId)
      setGoals(goals.filter((g) => g.id !== goalId))
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  // Delete category (if empty)
  const deleteCategory = (category: string) => {
    const categoryGoals = getGoalsByCategory()[category] || []
    if (categoryGoals.length > 0) {
      alert("Cannot delete category with goals")
      return
    }
    setCategories(categories.filter((c) => c !== category))
  }

  const goalsByCategory = getGoalsByCategory()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">Loading goals...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">1-Year Goals</h1>
            <p className="text-muted-foreground">Plan and track your 1-year goals</p>
          </div>
          <Button onClick={() => setShowAddCategory(true)} className="bg-black text-white hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Empty State */}
        {Object.keys(goalsByCategory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-muted p-4">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No goals yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Get started by adding your first category to track your progress over the next year.
                </p>
              </div>
              <Button onClick={() => setShowAddCategory(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add your first category
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(goalsByCategory).map(([category, categoryGoals]) => (
              <Card
                key={category}
                className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                    >
                      {category}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCategory(category)
                              setShowAddGoal(true)
                            }}
                          >
                            <Target className="h-4 w-4 mr-2" />
                            Add Goal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCategory(category)
                              setShowAddGoal(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Goal
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteCategory(category)}
                            disabled={categoryGoals.length > 0}
                            className={
                              categoryGoals.length > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-600"
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {categoryGoals.length} goal{categoryGoals.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {categoryGoals.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No goals in this category yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowAddGoal(true)
                        }}
                        className="text-sm bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add first goal
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {categoryGoals.map((goal) => (
                          <div
                            key={goal.id}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <button
                              onClick={() => toggleCompletion(goal)}
                              className="mt-1 flex-shrink-0"
                            >
                              {goal.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-300" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${
                                  goal.completed
                                    ? "line-through text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {goal.title}
                              </p>
                              {goal.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {goal.description.split("|").slice(1).join("|").trim()}
                                </p>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingGoal(goal)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteGoal(goal.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">
                            {getCompletionProgress(categoryGoals)}% Complete
                          </span>
                        </div>
                        <Progress value={getCompletionProgress(categoryGoals)} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for your 1-year goals
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                placeholder="e.g., Health, Career, Finance"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") addCategory()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategory(false)}>
              Cancel
            </Button>
            <Button onClick={addCategory} className="bg-black text-white hover:bg-gray-800">
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={showAddGoal || !!editingGoal} onOpenChange={(open) => {
        if (!open) {
          setShowAddGoal(false)
          setEditingGoal(null)
          setNewGoal({ title: "", description: "" })
          setSelectedCategory("")
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Goal" : "Add Goal"}</DialogTitle>
            <DialogDescription>
              {editingGoal
                ? "Update your goal details"
                : `Add a new goal to ${selectedCategory}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="What do you want to achieve?"
                value={editingGoal ? editingGoal.title : newGoal.title}
                onChange={(e) => {
                  if (editingGoal) {
                    setEditingGoal({ ...editingGoal, title: e.target.value })
                  } else {
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional details..."
                value={
                  editingGoal
                    ? editingGoal.description?.split("|").slice(1).join("|").trim() || ""
                    : newGoal.description
                }
                onChange={(e) => {
                  if (editingGoal) {
                    const category = editingGoal.description?.split("|")[0]?.trim() || "General"
                    setEditingGoal({
                      ...editingGoal,
                      description: `${category}|${e.target.value}`,
                    })
                  } else {
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                }}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddGoal(false)
                setEditingGoal(null)
                setNewGoal({ title: "", description: "" })
                setSelectedCategory("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingGoal ? updateGoal : addGoal}
              className="bg-black text-white hover:bg-gray-800"
            >
              {editingGoal ? "Update Goal" : "Add Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

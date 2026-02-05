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
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalCategory, setNewGoalCategory] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")

  // Load goals on component mount
  useEffect(() => {
    const loadGoals = async () => {
      if (!user?.id) return
      try {
        const data = await getLongTermGoals(user.id, "1_year")
        setGoals(data)
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map(g => g.category).filter(Boolean)))
        setCategories(uniqueCategories as string[])
      } catch (error) {
        console.error("[v0] Error loading goals:", error)
      } finally {
        setLoading(false)
      }
    }
    loadGoals()
  }, [user?.id])

  // Group goals by category
  const goalsByCategory: GoalsByCategory = {}
  goals.forEach(goal => {
    const category = goal.category || "Uncategorized"
    if (!goalsByCategory[category]) {
      goalsByCategory[category] = []
    }
    goalsByCategory[category].push(goal)
  })

  const handleAddGoal = async () => {
    if (!user?.id || !newGoalTitle.trim()) return

    try {
      await createLongTermGoal(user.id, {
        title: newGoalTitle,
        description: newGoalDescription,
        category: newGoalCategory || "Uncategorized",
        goal_type: "1_year",
        target_date: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0],
      })

      // Reload goals
      const data = await getLongTermGoals(user.id, "1_year")
      setGoals(data)
      const uniqueCategories = Array.from(new Set(data.map(g => g.category).filter(Boolean)))
      setCategories(uniqueCategories as string[])

      // Reset form
      setNewGoalTitle("")
      setNewGoalDescription("")
      setNewGoalCategory("")
      setShowAddGoal(false)
    } catch (error) {
      console.error("[v0] Error creating goal:", error)
    }
  }

  const handleToggleCompletion = async (goal: LongTermGoal) => {
    if (!user?.id) return

    try {
      await toggleLongTermGoalCompletion(user.id, goal.id, !goal.completed)
      
      const data = await getLongTermGoals(user.id, "1_year")
      setGoals(data)
    } catch (error) {
      console.error("[v0] Error updating goal:", error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!user?.id) return

    try {
      await deleteLongTermGoal(user.id, goalId)
      
      const data = await getLongTermGoals(user.id, "1_year")
      setGoals(data)
      const uniqueCategories = Array.from(new Set(data.map(g => g.category).filter(Boolean)))
      setCategories(uniqueCategories as string[])
    } catch (error) {
      console.error("[v0] Error deleting goal:", error)
    }
  }

  const handleEditGoal = async (goal: LongTermGoal) => {
    if (!user?.id) return

    try {
      await updateLongTermGoal(user.id, goal.id, {
        title: goal.title,
        description: goal.description,
        category: goal.category,
      })

      const data = await getLongTermGoals(user.id, "1_year")
      setGoals(data)
      setEditingGoal(null)
    } catch (error) {
      console.error("[v0] Error updating goal:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading 1-year goals...</p>
      </div>
    )
  }

  const categoryList = Object.keys(goalsByCategory)

  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">1-Year Goals</h1>
          <p className="text-muted-foreground">Plan and track your yearly objectives</p>
        </div>
        <Button onClick={() => setShowAddGoal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      {/* Goals by Category */}
      {categoryList.length === 0 ? (
        <Card>
          <CardContent className="pt-8 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground">No 1-year goals yet. Create one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {categoryList.map(category => {
            const categoryGoals = goalsByCategory[category]
            const completedCount = categoryGoals.filter(g => g.completed).length
            const progressPercent = (completedCount / categoryGoals.length) * 100

            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{category}</h2>
                    <p className="text-sm text-muted-foreground">{completedCount} of {categoryGoals.length} completed</p>
                  </div>
                  <Badge>{completedCount}/{categoryGoals.length}</Badge>
                </div>

                <Progress value={progressPercent} className="h-2" />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryGoals.map(goal => (
                    <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => handleToggleCompletion(goal)}
                            className="mt-1 flex-shrink-0"
                          >
                            {goal.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingGoal(goal)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteGoal(goal.id)} className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className={goal.completed ? "line-through text-muted-foreground" : ""}>
                          {goal.title}
                        </CardDescription>
                      </CardHeader>
                      {goal.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add 1-Year Goal</DialogTitle>
            <DialogDescription>Create a new goal for your 1-year plan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                placeholder="e.g., Complete certification"
              />
            </div>
            <div>
              <Label htmlFor="goal-description">Description (optional)</Label>
              <Textarea
                id="goal-description"
                value={newGoalDescription}
                onChange={e => setNewGoalDescription(e.target.value)}
                placeholder="Add details about your goal"
              />
            </div>
            <div>
              <Label htmlFor="goal-category">Category</Label>
              <Select value={newGoalCategory} onValueChange={setNewGoalCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or create category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="mt-2"
                placeholder="Or type a new category name"
                value={newGoalCategory}
                onChange={e => setNewGoalCategory(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGoal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      {editingGoal && (
        <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
              <DialogDescription>Update your goal details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingGoal.title}
                  onChange={e => setEditingGoal({ ...editingGoal, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingGoal.description}
                  onChange={e => setEditingGoal({ ...editingGoal, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editingGoal.category}
                  onChange={e => setEditingGoal({ ...editingGoal, category: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingGoal(null)}>
                Cancel
              </Button>
              <Button onClick={() => editingGoal && handleEditGoal(editingGoal)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  )
}

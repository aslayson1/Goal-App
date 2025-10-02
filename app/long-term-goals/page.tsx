"use client"

import { useState, useEffect } from "react"
import { Plus, Target, Trash2, Check } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  getLongTermGoals,
  createLongTermGoal,
  toggleLongTermGoalCompletion,
  deleteLongTermGoal,
  type LongTermGoal,
} from "@/lib/data/long-term-goals"
import { useToast } from "@/hooks/use-toast"

export default function LongTermGoalsPage() {
  const [oneYearGoals, setOneYearGoals] = useState<LongTermGoal[]>([])
  const [fiveYearGoals, setFiveYearGoals] = useState<LongTermGoal[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [goalType, setGoalType] = useState<"1_year" | "5_year">("1_year")
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      const oneYear = await getLongTermGoals("1_year")
      const fiveYear = await getLongTermGoals("5_year")
      setOneYearGoals(oneYear)
      setFiveYearGoals(fiveYear)
    } catch (error) {
      console.error("Error loading goals:", error)
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive",
      })
    }
  }

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive",
      })
      return
    }

    try {
      await createLongTermGoal({
        title: newGoalTitle,
        description: newGoalDescription || null,
        goal_type: goalType,
        completed: false,
        completed_at: null,
      })

      setNewGoalTitle("")
      setNewGoalDescription("")
      setIsAddDialogOpen(false)
      await loadGoals()

      toast({
        title: "Success",
        description: "Goal added successfully",
      })
    } catch (error) {
      console.error("Error adding goal:", error)
      toast({
        title: "Error",
        description: "Failed to add goal",
        variant: "destructive",
      })
    }
  }

  const handleToggleCompletion = async (id: string, completed: boolean) => {
    try {
      await toggleLongTermGoalCompletion(id, !completed)
      await loadGoals()
      toast({
        title: "Success",
        description: completed ? "Goal marked as incomplete" : "Goal completed!",
      })
    } catch (error) {
      console.error("Error toggling goal:", error)
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteLongTermGoal(id)
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
  }

  const GoalCard = ({ goal }: { goal: LongTermGoal }) => (
    <Card className={goal.completed ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={goal.completed}
              onCheckedChange={() => handleToggleCompletion(goal.id, goal.completed)}
              className="mt-1"
            />
            <div className="flex-1">
              <CardTitle className={`text-lg ${goal.completed ? "line-through" : ""}`}>{goal.title}</CardTitle>
              {goal.description && <CardDescription className="mt-1.5 text-sm">{goal.description}</CardDescription>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteGoal(goal.id)}
            className="size-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>
      {goal.completed && goal.completed_at && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="size-3" />
            <span>Completed {new Date(goal.completed_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      )}
    </Card>
  )

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
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Set and track your long-term aspirations for the next 1 and 5 years
            </p>
          </div>

          <Tabs defaultValue="1_year" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="1_year">1 Year Goals</TabsTrigger>
              <TabsTrigger value="5_year">5 Year Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="1_year" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">1 Year Goals</h2>
                <Button
                  onClick={() => {
                    setGoalType("1_year")
                    setIsAddDialogOpen(true)
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              {oneYearGoals.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="size-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No 1-year goals yet. Start by adding your first goal!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {oneYearGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="5_year" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">5 Year Goals</h2>
                <Button
                  onClick={() => {
                    setGoalType("5_year")
                    setIsAddDialogOpen(true)
                  }}
                >
                  <Plus className="size-4 mr-2" />
                  Add Goal
                </Button>
              </div>

              {fiveYearGoals.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="size-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No 5-year goals yet. Start by adding your first goal!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {fiveYearGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {goalType === "1_year" ? "1 Year" : "5 Year"} Goal</DialogTitle>
            <DialogDescription>Create a new long-term goal to track your progress over time.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="Enter your goal..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details about your goal..."
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

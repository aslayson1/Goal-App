"use client"

import { useEffect, useState } from "react"
import { getGoals, deleteGoal, updateGoalProgress, type Goal } from "@/lib/data/goals"
import { GoalCard } from "./goal-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadGoals = async () => {
    try {
      setIsLoading(true)
      const data = await getGoals()
      setGoals(data)
    } catch (error) {
      console.error("Failed to load goals:", error)
      toast({
        title: "Error",
        description: "Failed to load goals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id)
      setGoals((prev) => prev.filter((goal) => goal.id !== id))
      toast({
        title: "Success",
        description: "Goal deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete goal:", error)
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleProgressUpdate = async (id: string, progress: number) => {
    try {
      await updateGoalProgress(id, progress)
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                current_progress: progress,
                completed: progress >= 100,
                completed_at: progress >= 100 ? new Date().toISOString() : null,
              }
            : goal,
        ),
      )
      toast({
        title: "Success",
        description: "Progress updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update progress:", error)
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading goals...</p>
        </div>
      </div>
    )
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
        <p className="text-muted-foreground mb-4">Start tracking your progress by creating your first goal.</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} onProgressUpdate={handleProgressUpdate} />
      ))}
    </div>
  )
}

function Target({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

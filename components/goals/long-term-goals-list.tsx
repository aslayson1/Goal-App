"use client"

import { useEffect, useState } from "react"
import {
  getLongTermGoals,
  deleteLongTermGoal,
  toggleLongTermGoalCompletion,
  type LongTermGoal,
} from "@/lib/data/long-term-goals"
import { LongTermGoalCard } from "./long-term-goal-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LongTermGoalsList() {
  const [goals, setGoals] = useState<LongTermGoal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadGoals = async () => {
    try {
      setIsLoading(true)
      const data = await getLongTermGoals()
      setGoals(data)
    } catch (error) {
      console.error("Failed to load long-term goals:", error)
      toast({
        title: "Error",
        description: "Failed to load long-term goals. Please try again.",
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
      await deleteLongTermGoal(id)
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

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await toggleLongTermGoalCompletion(id, completed)
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                completed,
                completed_at: completed ? new Date().toISOString() : null,
              }
            : goal,
        ),
      )
      toast({
        title: "Success",
        description: completed ? "Goal marked as complete!" : "Goal marked as incomplete.",
      })
    } catch (error) {
      console.error("Failed to toggle completion:", error)
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const oneYearGoals = goals.filter((g) => g.goal_type === "1_year")
  const fiveYearGoals = goals.filter((g) => g.goal_type === "5_year")

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
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No long-term goals yet</h3>
        <p className="text-muted-foreground mb-4">Set your vision for the future by creating long-term goals.</p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>
    )
  }

  return (
    <Tabs defaultValue="1-year" className="w-full">
      <TabsList>
        <TabsTrigger value="1-year">1 Year ({oneYearGoals.length})</TabsTrigger>
        <TabsTrigger value="5-year">5 Year ({fiveYearGoals.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="1-year" className="mt-6">
        {oneYearGoals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No 1-year goals yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {oneYearGoals.map((goal) => (
              <LongTermGoalCard
                key={goal.id}
                goal={goal}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="5-year" className="mt-6">
        {fiveYearGoals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No 5-year goals yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fiveYearGoals.map((goal) => (
              <LongTermGoalCard
                key={goal.id}
                goal={goal}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

function TrendingUp({ className }: { className?: string }) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

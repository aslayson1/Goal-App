"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Plus, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { updateGoal, deleteGoal, type Goal, type Category } from "@/lib/database/goals"

interface GoalCardProps {
  goal: Goal
  category?: Category
  onUpdate: () => void
}

export function GoalCard({ goal, category, onUpdate }: GoalCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const progressPercentage = goal.target_count > 0 ? Math.round((goal.current_progress / goal.target_count) * 100) : 0

  const handleProgressUpdate = async (increment: number) => {
    setIsUpdating(true)
    const newProgress = Math.max(0, Math.min(goal.target_count, goal.current_progress + increment))
    const isCompleted = newProgress >= goal.target_count

    await updateGoal(goal.id, {
      current_progress: newProgress,
      completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })

    onUpdate()
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      await deleteGoal(goal.id)
      onUpdate()
    }
  }

  const handleToggleComplete = async () => {
    setIsUpdating(true)
    await updateGoal(goal.id, {
      completed: !goal.completed,
      completed_at: !goal.completed ? new Date().toISOString() : null,
      current_progress: !goal.completed ? goal.target_count : goal.current_progress,
    })
    onUpdate()
    setIsUpdating(false)
  }

  return (
    <Card
      className={`border-border bg-card transition-all duration-200 hover:shadow-lg ${
        goal.completed ? "opacity-75" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {category && (
                <Badge variant="secondary" className={`${category.color} text-xs`}>
                  {category.name}
                </Badge>
              )}
              {goal.completed && (
                <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Completed
                </Badge>
              )}
            </div>
            <CardTitle
              className={`text-lg ${goal.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {goal.title}
            </CardTitle>
            {goal.description && <CardDescription className="mt-1">{goal.description}</CardDescription>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleComplete}>
                {goal.completed ? "Mark Incomplete" : "Mark Complete"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {goal.current_progress} / {goal.target_count}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">{progressPercentage}% complete</div>
        </div>

        {!goal.completed && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProgressUpdate(-1)}
              disabled={isUpdating || goal.current_progress <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleProgressUpdate(1)}
              disabled={isUpdating || goal.current_progress >= goal.target_count}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {goal.weekly_target > 0 && (
          <div className="text-xs text-muted-foreground text-center">Weekly target: {goal.weekly_target}</div>
        )}
      </CardContent>
    </Card>
  )
}

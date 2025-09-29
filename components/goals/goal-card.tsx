"use client"

import { useState } from "react"
import type { Goal } from "@/lib/data/goals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, CheckCircle2 } from "lucide-react"

interface GoalCardProps {
  goal: Goal
  onDelete: (id: string) => Promise<void>
  onProgressUpdate: (id: string, progress: number) => Promise<void>
}

export function GoalCard({ goal, onDelete, onProgressUpdate }: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(goal.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const progressPercentage = Math.min((goal.current_progress / goal.target_count) * 100, 100)

  return (
    <Card className={goal.completed ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{goal.title}</CardTitle>
              {goal.completed && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            {goal.description && <CardDescription>{goal.description}</CardDescription>}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete goal</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{goal.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {goal.current_progress} / {goal.target_count}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progressPercentage.toFixed(0)}% complete</span>
            <span>Weekly target: {goal.weekly_target}</span>
          </div>
        </div>

        {!goal.completed && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onProgressUpdate(goal.id, Math.min(goal.current_progress + 1, goal.target_count))}
            >
              +1
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onProgressUpdate(goal.id, Math.min(goal.current_progress + goal.weekly_target, goal.target_count))
              }
            >
              +{goal.weekly_target}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

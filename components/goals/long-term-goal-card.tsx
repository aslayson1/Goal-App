"use client"

import { useState } from "react"
import type { LongTermGoal } from "@/lib/data/long-term-goals"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Trash2, CheckCircle2, Calendar } from "lucide-react"

interface LongTermGoalCardProps {
  goal: LongTermGoal
  onDelete: (id: string) => Promise<void>
  onToggleComplete: (id: string, completed: boolean) => Promise<void>
}

export function LongTermGoalCard({ goal, onDelete, onToggleComplete }: LongTermGoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(goal.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const goalTypeLabel = goal.goal_type === "1_year" ? "1 Year" : "5 Year"

  return (
    <Card className={goal.completed ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={goal.completed}
                onCheckedChange={(checked) => onToggleComplete(goal.id, checked === true)}
                className="mt-1"
              />
              <CardTitle className={`text-xl ${goal.completed ? "line-through text-muted-foreground" : ""}`}>
                {goal.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                {goalTypeLabel}
              </Badge>
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
      {goal.completed_at && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Completed on {new Date(goal.completed_at).toLocaleDateString()}
          </p>
        </CardContent>
      )}
    </Card>
  )
}

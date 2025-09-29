"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Calendar, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { updateTask, deleteTask, type Task, type Category, type Goal } from "@/lib/database/goals"

interface TaskCardProps {
  task: Task
  category?: Category
  goal?: Goal
  onUpdate: () => void
}

export function TaskCard({ task, category, goal, onUpdate }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleComplete = async (checked: boolean) => {
    setIsUpdating(true)
    await updateTask(task.id, {
      completed: checked,
      completed_at: checked ? new Date().toISOString() : null,
    })
    onUpdate()
    setIsUpdating(false)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id)
      onUpdate()
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card
      className={`border-border bg-card transition-all duration-200 hover:shadow-lg ${
        task.completed ? "opacity-75" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              disabled={isUpdating}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {category && (
                  <Badge variant="secondary" className={`${category.color} text-xs`}>
                    {category.name}
                  </Badge>
                )}
                {task.completed && (
                  <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle
                className={`text-lg ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
              >
                {task.title}
              </CardTitle>
              {task.description && <CardDescription className="mt-1">{task.description}</CardDescription>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {goal && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>Related to: {goal.title}</span>
          </div>
        )}

        {task.target_date && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {formatDate(task.target_date)}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground">Type: {task.task_type}</div>
      </CardContent>
    </Card>
  )
}

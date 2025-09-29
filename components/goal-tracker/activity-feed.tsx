"use client"

import { useMemo } from "react"
import { CheckCircle, Target, Plus, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Goal, Task, Category } from "@/lib/database/goals"

interface ActivityFeedProps {
  goals: Goal[]
  tasks: Task[]
  categories: Category[]
}

interface ActivityItem {
  id: string
  type: "goal_completed" | "task_completed" | "goal_created" | "task_created"
  title: string
  description: string
  date: Date
  category?: Category
}

export function ActivityFeed({ goals, tasks, categories }: ActivityFeedProps) {
  const activities = useMemo(() => {
    const items: ActivityItem[] = []

    // Add goal activities
    goals.forEach((goal) => {
      const category = categories.find((c) => c.id === goal.category_id)

      // Goal creation
      items.push({
        id: `goal_created_${goal.id}`,
        type: "goal_created",
        title: `Created goal: ${goal.title}`,
        description: goal.description || "No description",
        date: new Date(goal.created_at),
        category,
      })

      // Goal completion
      if (goal.completed && goal.completed_at) {
        items.push({
          id: `goal_completed_${goal.id}`,
          type: "goal_completed",
          title: `Completed goal: ${goal.title}`,
          description: `Reached ${goal.current_progress}/${goal.target_count}`,
          date: new Date(goal.completed_at),
          category,
        })
      }
    })

    // Add task activities
    tasks.forEach((task) => {
      const category = categories.find((c) => c.id === task.category_id)

      // Task creation
      items.push({
        id: `task_created_${task.id}`,
        type: "task_created",
        title: `Created task: ${task.title}`,
        description: task.description || "No description",
        date: new Date(task.created_at),
        category,
      })

      // Task completion
      if (task.completed && task.completed_at) {
        items.push({
          id: `task_completed_${task.id}`,
          type: "task_completed",
          title: `Completed task: ${task.title}`,
          description: task.description || "Task completed",
          date: new Date(task.completed_at),
          category,
        })
      }
    })

    // Sort by date (most recent first)
    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20)
  }, [goals, tasks, categories])

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "goal_completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-blue-400" />
      case "goal_created":
        return <Target className="h-4 w-4 text-primary" />
      case "task_created":
        return <Plus className="h-4 w-4 text-muted-foreground" />
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
        <CardDescription>Your latest goals and tasks activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                  {activity.category && (
                    <Badge variant="secondary" className={`${activity.category.color} text-xs mt-2`}>
                      {activity.category.name}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

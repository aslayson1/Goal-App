"use client"

import { Target, CheckCircle, TrendingUp, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Goal, Task, Category } from "@/lib/database/goals"

interface StatsOverviewProps {
  goals: Goal[]
  tasks: Task[]
  categories: Category[]
}

export function StatsOverview({ goals, tasks, categories }: StatsOverviewProps) {
  const getOverallProgress = () => {
    if (goals.length === 0) return 0
    const totalProgress = goals.reduce((sum, goal) => {
      return sum + (goal.target_count > 0 ? (goal.current_progress / goal.target_count) * 100 : 0)
    }, 0)
    return Math.round(totalProgress / goals.length)
  }

  const getCompletedGoals = () => goals.filter((goal) => goal.completed).length
  const getCompletedTasks = () => tasks.filter((task) => task.completed).length

  const stats = [
    {
      title: "Overall Progress",
      value: `${getOverallProgress()}%`,
      icon: Target,
      progress: getOverallProgress(),
      color: "text-primary",
    },
    {
      title: "Tasks Completed",
      value: `${getCompletedTasks()}/${tasks.length}`,
      icon: CheckCircle,
      progress: tasks.length > 0 ? (getCompletedTasks() / tasks.length) * 100 : 0,
      color: "text-primary",
    },
    {
      title: "Goals Completed",
      value: `${getCompletedGoals()}/${goals.length}`,
      icon: TrendingUp,
      progress: goals.length > 0 ? (getCompletedGoals() / goals.length) * 100 : 0,
      color: "text-primary",
    },
    {
      title: "Categories",
      value: `${categories.length}`,
      icon: BarChart3,
      progress: Math.min(categories.length * 20, 100),
      color: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="border-border bg-card hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
              <p className="text-4xl font-bold text-foreground">{stat.value}</p>
              <div className="flex items-center">
                <stat.icon className={`h-4 w-4 mr-2 ${stat.color}`} />
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </div>
              <div className="w-full">
                <Progress value={stat.progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

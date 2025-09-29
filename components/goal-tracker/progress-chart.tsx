"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Goal, Task } from "@/lib/database/goals"

interface ProgressChartProps {
  goals: Goal[]
  tasks: Task[]
}

export function ProgressChart({ goals, tasks }: ProgressChartProps) {
  const progressData = useMemo(() => {
    // Generate last 30 days of data
    const days = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Calculate goals completed by this date
      const goalsCompletedByDate = goals.filter((goal) => {
        if (!goal.completed_at) return false
        return new Date(goal.completed_at) <= date
      }).length

      // Calculate tasks completed by this date
      const tasksCompletedByDate = tasks.filter((task) => {
        if (!task.completed_at) return false
        return new Date(task.completed_at) <= date
      }).length

      // Calculate average progress
      const totalProgress = goals.reduce((sum, goal) => {
        const goalDate = new Date(goal.created_at)
        if (goalDate <= date) {
          return sum + (goal.target_count > 0 ? (goal.current_progress / goal.target_count) * 100 : 0)
        }
        return sum
      }, 0)

      const averageProgress = goals.length > 0 ? totalProgress / goals.length : 0

      days.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        goals: goalsCompletedByDate,
        tasks: tasksCompletedByDate,
        progress: Math.round(averageProgress),
      })
    }

    return days
  }, [goals, tasks])

  const categoryData = useMemo(() => {
    const categoryMap = new Map()

    goals.forEach((goal) => {
      const categoryId = goal.category_id
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          categoryId,
          total: 0,
          completed: 0,
          progress: 0,
        })
      }

      const category = categoryMap.get(categoryId)
      category.total += 1
      if (goal.completed) category.completed += 1
      category.progress += goal.target_count > 0 ? (goal.current_progress / goal.target_count) * 100 : 0
    })

    return Array.from(categoryMap.values()).map((cat) => ({
      ...cat,
      progress: Math.round(cat.progress / Math.max(cat.total, 1)),
    }))
  }, [goals])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Progress Over Time</CardTitle>
              <CardDescription>Your goal and task completion progress over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Average Progress %"
                  />
                  <Line
                    type="monotone"
                    dataKey="goals"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Goals Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    name="Tasks Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Progress by Category</CardTitle>
              <CardDescription>Average progress across different goal categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="categoryId" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Bar dataKey="progress" fill="hsl(var(--primary))" name="Average Progress %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Completion Rate</CardTitle>
                <CardDescription>Goals vs Tasks completion comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Goals</span>
                    <span className="text-sm font-medium text-foreground">
                      {goals.filter((g) => g.completed).length} / {goals.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tasks</span>
                    <span className="text-sm font-medium text-foreground">
                      {tasks.filter((t) => t.completed).length} / {tasks.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Activity Summary</CardTitle>
                <CardDescription>Recent activity overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Goals this week</span>
                    <span className="text-sm font-medium text-foreground">
                      {
                        goals.filter((g) => {
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return new Date(g.created_at) >= weekAgo
                        }).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tasks this week</span>
                    <span className="text-sm font-medium text-foreground">
                      {
                        tasks.filter((t) => {
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return new Date(t.created_at) >= weekAgo
                        }).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

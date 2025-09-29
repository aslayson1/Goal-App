"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import {
  getGoals,
  getCategories,
  getTasks,
  getLongTermGoals,
  type Goal,
  type Category,
  type Task,
  type LongTermGoal,
} from "@/lib/database/goals"
import { Header } from "./header"
import { StatsOverview } from "./stats-overview"
import { GoalCard } from "./goal-card"
import { TaskCard } from "./task-card"
import { CreateGoalDialog } from "./create-goal-dialog"
import { CreateCategoryDialog } from "./create-category-dialog"
import { ProgressChart } from "./progress-chart"
import { ActivityFeed } from "./activity-feed"
import { StreakTracker } from "./streak-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AchievementsPanel } from "./achievements-panel"

export function Dashboard() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("overview")
  const [showCreateGoal, setShowCreateGoal] = useState(false)
  const [showCreateCategory, setShowCreateCategory] = useState(false)

  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id])

  const loadData = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const [goalsData, categoriesData, tasksData, longTermGoalsData] = await Promise.all([
        getGoals(user.id),
        getCategories(user.id),
        getTasks(user.id),
        getLongTermGoals(user.id),
      ])

      setGoals(goalsData)
      setCategories(categoriesData)
      setTasks(tasksData)
      setLongTermGoals(longTermGoalsData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "Uncategorized"
  }

  const getCurrentStreak = () => {
    const activities = [...goals, ...tasks]
      .filter((item) => item.completed_at)
      .map((item) => new Date(item.completed_at!))
      .sort((a, b) => b.getTime() - a.getTime())

    const activityDates = new Set(activities.map((date) => date.toDateString()))
    const today = new Date()
    let currentStreak = 0

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)

      if (activityDates.has(checkDate.toDateString())) {
        if (i === 0 || currentStreak > 0) {
          currentStreak++
        }
      } else if (i === 0) {
        continue
      } else {
        break
      }
    }

    return currentStreak
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header onCreateGoal={() => setShowCreateGoal(true)} onCreateCategory={() => setShowCreateCategory(true)} />

        <StatsOverview goals={goals} tasks={tasks} categories={categories} />

        {/* View Toggle */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-8">
          <TabsList className="grid w-full max-w-3xl grid-cols-6 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Goals
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Tasks
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="space-y-8">
              <StreakTracker goals={goals} tasks={tasks} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Goals */}
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Goals</CardTitle>
                    <CardDescription>Your latest goal progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {goals.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No goals yet. Create your first goal to get started!</p>
                      </div>
                    ) : (
                      goals.slice(0, 3).map((goal) => (
                        <div
                          key={goal.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{goal.title}</h4>
                            <p className="text-sm text-muted-foreground">{getCategoryName(goal.category_id)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {goal.current_progress}/{goal.target_count}
                            </p>
                            <Progress
                              value={goal.target_count > 0 ? (goal.current_progress / goal.target_count) * 100 : 0}
                              className="h-2 w-20"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Categories Overview */}
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Categories</CardTitle>
                    <CardDescription>Your goal categories</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categories.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No categories yet. Create categories to organize your goals!
                        </p>
                      </div>
                    ) : (
                      categories.map((category) => {
                        const categoryGoals = goals.filter((g) => g.category_id === category.id)
                        const completedGoals = categoryGoals.filter((g) => g.completed).length

                        return (
                          <div
                            key={category.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${category.color}`} />
                              <div>
                                <h4 className="font-medium text-foreground">{category.name}</h4>
                                <p className="text-sm text-muted-foreground">{categoryGoals.length} goals</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-muted/50">
                              {completedGoals}/{categoryGoals.length}
                            </Badge>
                          </div>
                        )
                      })
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-8">
            {goals.length === 0 ? (
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No goals yet. Create your first goal to get started!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    category={categories.find((c) => c.id === goal.category_id)}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="mt-8">
            {tasks.length === 0 ? (
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No tasks yet. Tasks will appear here when you create them!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={categories.find((c) => c.id === task.category_id)}
                    goal={goals.find((g) => g.id === task.goal_id)}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <ProgressChart goals={goals} tasks={tasks} />
          </TabsContent>

          <TabsContent value="activity" className="mt-8">
            <ActivityFeed goals={goals} tasks={tasks} categories={categories} />
          </TabsContent>

          <TabsContent value="achievements" className="mt-8">
            <AchievementsPanel goals={goals} tasks={tasks} categories={categories} currentStreak={getCurrentStreak()} />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <CreateGoalDialog
          open={showCreateGoal}
          onOpenChange={setShowCreateGoal}
          categories={categories}
          onSuccess={loadData}
        />

        <CreateCategoryDialog open={showCreateCategory} onOpenChange={setShowCreateCategory} onSuccess={loadData} />
      </div>
    </div>
  )
}

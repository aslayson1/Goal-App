"use client"
import { useAuth } from "@/components/auth/auth-provider"
import { AuthScreen } from "@/components/auth/auth-screen"
import { GoalsList } from "./goals-list"
import { LongTermGoalsList } from "./long-term-goals-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp } from "lucide-react"

export function GoalsDashboard() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Goal Tracker</h1>
          <p className="text-muted-foreground text-pretty">
            Track your progress and achieve your goals, one step at a time.
          </p>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="weekly" className="gap-2">
              <Target className="h-4 w-4" />
              Weekly Goals
            </TabsTrigger>
            <TabsTrigger value="long-term" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Long-term Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Goals</CardTitle>
                <CardDescription>Track your weekly progress and targets</CardDescription>
              </CardHeader>
              <CardContent>
                <GoalsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="long-term" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Long-term Goals</CardTitle>
                <CardDescription>Your 1-year and 5-year aspirations</CardDescription>
              </CardHeader>
              <CardContent>
                <LongTermGoalsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

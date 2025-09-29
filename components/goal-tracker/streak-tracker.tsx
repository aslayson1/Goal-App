"use client"

import { useMemo } from "react"
import { Flame, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Goal, Task } from "@/lib/database/goals"

interface StreakTrackerProps {
  goals: Goal[]
  tasks: Task[]
}

export function StreakTracker({ goals, tasks }: StreakTrackerProps) {
  const streakData = useMemo(() => {
    // Calculate current streak (consecutive days with activity)
    let currentStreak = 0
    let longestStreak = 0
    const tempStreak = 0

    const today = new Date()
    const activities = [...goals, ...tasks]
      .filter((item) => item.completed_at)
      .map((item) => new Date(item.completed_at!))
      .sort((a, b) => b.getTime() - a.getTime())

    // Group activities by date
    const activityDates = new Set(activities.map((date) => date.toDateString()))

    // Calculate current streak
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)

      if (activityDates.has(checkDate.toDateString())) {
        if (i === 0 || currentStreak > 0) {
          currentStreak++
        }
      } else if (i === 0) {
        // No activity today, check yesterday
        continue
      } else {
        break
      }
    }

    // Calculate longest streak
    let consecutiveDays = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)

      if (activityDates.has(checkDate.toDateString())) {
        consecutiveDays++
        longestStreak = Math.max(longestStreak, consecutiveDays)
      } else {
        consecutiveDays = 0
      }
    }

    // Calculate this week's activity
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay())
    thisWeekStart.setHours(0, 0, 0, 0)

    const thisWeekActivities = activities.filter((date) => date >= thisWeekStart).length

    // Calculate this month's activity
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const thisMonthActivities = activities.filter((date) => date >= thisMonthStart).length

    return {
      currentStreak,
      longestStreak,
      thisWeekActivities,
      thisMonthActivities,
      totalActivities: activities.length,
    }
  }, [goals, tasks])

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Legend" }
    if (streak >= 14) return { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Fire" }
    if (streak >= 7) return { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Hot" }
    if (streak >= 3) return { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Warm" }
    return { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "Getting Started" }
  }

  const streakBadge = getStreakBadge(streakData.currentStreak)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Flame className="h-5 w-5 text-orange-400" />
            <span>Current Streak</span>
          </CardTitle>
          <CardDescription>Consecutive days with completed goals or tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-foreground">{streakData.currentStreak}</div>
            <div className="text-sm text-muted-foreground">{streakData.currentStreak === 1 ? "day" : "days"}</div>
            <Badge variant="secondary" className={streakBadge.color}>
              {streakBadge.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Statistics</span>
          </CardTitle>
          <CardDescription>Your activity statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Longest Streak</span>
              <span className="text-sm font-medium text-foreground">{streakData.longestStreak} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="text-sm font-medium text-foreground">{streakData.thisWeekActivities} completions</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="text-sm font-medium text-foreground">{streakData.thisMonthActivities} completions</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-sm font-medium text-foreground">{streakData.totalActivities} completions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

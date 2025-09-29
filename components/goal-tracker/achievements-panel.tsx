"use client"

import { useState, useEffect } from "react"
import { Trophy, Award, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import {
  getAchievements,
  getUserAchievements,
  checkAndAwardAchievements,
  type Achievement,
  type UserAchievement,
} from "@/lib/database/achievements"
import { AchievementBadge } from "./achievement-badge"
import type { Goal, Task, Category } from "@/lib/database/goals"

interface AchievementsPanelProps {
  goals: Goal[]
  tasks: Task[]
  categories: Category[]
  currentStreak: number
}

export function AchievementsPanel({ goals, tasks, categories, currentStreak }: AchievementsPanelProps) {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadAchievements()
    }
  }, [user?.id, goals, tasks, categories, currentStreak])

  const loadAchievements = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const [allAchievements, userAchievementsData] = await Promise.all([
        getAchievements(),
        getUserAchievements(user.id),
      ])

      setAchievements(allAchievements)
      setUserAchievements(userAchievementsData)

      // Check for new achievements
      const stats = {
        currentStreak,
        totalGoals: goals.length,
        completedGoals: goals.filter((g) => g.completed).length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((t) => t.completed).length,
        totalCategories: categories.length,
      }

      const newAchievements = await checkAndAwardAchievements(user.id, stats)
      if (newAchievements.length > 0) {
        setUserAchievements((prev) => [...newAchievements, ...prev])
      }
    } catch (error) {
      console.error("Error loading achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  const earnedAchievementIds = new Set(userAchievements.map((ua) => ua.achievement_id))
  const earnedAchievements = userAchievements.filter((ua) => ua.achievement)
  const availableAchievements = achievements.filter((a) => !earnedAchievementIds.has(a.id))

  const getProgressForAchievement = (achievement: Achievement) => {
    const stats = {
      currentStreak,
      totalGoals: goals.length,
      completedGoals: goals.filter((g) => g.completed).length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.completed).length,
      totalCategories: categories.length,
    }

    switch (achievement.badge_type) {
      case "streak":
        return Math.min(stats.currentStreak, achievement.requirement_value)
      case "goals":
        return achievement.title === "Goal Setter"
          ? Math.min(stats.totalGoals, achievement.requirement_value)
          : Math.min(stats.completedGoals, achievement.requirement_value)
      case "tasks":
        return Math.min(stats.completedTasks, achievement.requirement_value)
      case "categories":
        return Math.min(stats.totalCategories, achievement.requirement_value)
      default:
        return 0
    }
  }

  const getAchievementsByLevel = (level: string) => {
    return earnedAchievements.filter((ua) => ua.achievement?.badge_level === level)
  }

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-foreground">{earnedAchievements.length}</div>
            <div className="text-sm text-muted-foreground">Achievements Earned</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">
              {Math.round((earnedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-foreground">{getAchievementsByLevel("platinum").length}</div>
            <div className="text-sm text-muted-foreground">Platinum Badges</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Tabs */}
      <Tabs defaultValue="earned" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="earned">Earned ({earnedAchievements.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({availableAchievements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-4">
          {earnedAchievements.length === 0 ? (
            <Card className="border-border bg-card/50">
              <CardContent className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No achievements earned yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Complete goals and tasks to start earning badges!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {earnedAchievements.map((userAchievement) => (
                <AchievementBadge key={userAchievement.id} userAchievement={userAchievement} size="md" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="space-y-4">
            {availableAchievements.map((achievement) => {
              const progress = getProgressForAchievement(achievement)
              const progressPercentage = (progress / achievement.requirement_value) * 100

              return (
                <Card key={achievement.id} className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${achievement.color} opacity-50`}>
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-foreground">{achievement.title}</h4>
                          <Badge variant="secondary" className={achievement.color}>
                            {achievement.badge_level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={progressPercentage} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground">
                            {progress}/{achievement.requirement_value}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

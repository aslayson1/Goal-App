'use client'

import { Progress } from "@/components/ui/progress"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Flame, Calendar, Trophy } from 'lucide-react'

export default function FitnessPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const [ranking, setRanking] = useState<number | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [fitnessGoals, setFitnessGoals] = useState<any[]>([])
  const [showGoalDialog, setShowGoalDialog] = useState(false)
  const [goalProgress, setGoalProgress] = useState<Record<string, any>>({})
  const [goalInputs, setGoalInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user || authLoading) return
    loadFitnessData()
    loadFitnessGoals()
  }, [user, authLoading, currentMonth])

  const loadFitnessData = async () => {
    setLoading(true)
    try {
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      // Load fitness logs for the month (for calendar display)
      const { data: logsData } = await supabase
        .from('fitness_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('logged_date', monthStart.toISOString().split('T')[0])
        .lte('logged_date', monthEnd.toISOString().split('T')[0])

      if (logsData) {
        setLogs(logsData)
      }

      // Load ALL logs for streak calculation
      const { data: allLogs } = await supabase
        .from('fitness_logs')
        .select('logged_date')
        .eq('user_id', user?.id)
        .order('logged_date', { ascending: false })

      // Calculate streak client-side
      if (allLogs && allLogs.length > 0) {
        const calculatedStreak = calculateStreak(allLogs.map(l => l.logged_date))
        setStreak(calculatedStreak)
      } else {
        setStreak(0)
      }

      // Load ranking from leaderboard
      await loadUserRanking()
    } catch (error) {
      console.error('Error loading fitness data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserRanking = async () => {
    try {
      if (!user?.id) return

      // Calculate this month's workouts
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      // Get all fitness logs for all users this month to build leaderboard
      const { data: allLogs } = await supabase
        .from('fitness_logs')
        .select('user_id, logged_date')
        .gte('logged_date', monthStart.toISOString().split('T')[0])
        .lte('logged_date', monthEnd.toISOString().split('T')[0])

      if (!allLogs) return

      // Count workouts per user
      const workoutsByUser: Record<string, number> = {}
      allLogs.forEach((log) => {
        if (log.user_id) {
          workoutsByUser[log.user_id] = (workoutsByUser[log.user_id] || 0) + 1
        }
      })

      // Create leaderboard sorted by workouts
      const leaderboard = Object.entries(workoutsByUser)
        .map(([userId, count]) => ({ userId, workouts: count }))
        .sort((a, b) => b.workouts - a.workouts)

      // Find current user's ranking
      const userRank = leaderboard.findIndex((entry) => entry.userId === user.id)
      setRanking(userRank >= 0 ? userRank + 1 : null)
    } catch (error) {
      console.error('[v0] Error loading user ranking:', error)
    }
  }

  const loadFitnessGoals = async () => {
    if (!user?.id) {
      console.log('[v0] loadFitnessGoals - no user')
      return
    }
    try {
      console.log('[v0] loadFitnessGoals - fetching goals for user:', user.id)
      
      // Load goals from Health or Fitness categories
      const { data: goals, error } = await supabase
        .from('goals')
        .select('*, categories(name)')
        .eq('user_id', user.id)
        .eq('completed', false)

      console.log('[v0] loadFitnessGoals - query result:', { error, count: goals?.length })
      console.log('[v0] loadFitnessGoals - raw goals:', goals)

      if (error) {
        console.error('Error loading fitness goals:', error)
        return
      }

      // Filter to only include goals from Health or Fitness categories
      const fitnessGoals = (goals || []).filter((goal: any) => {
        const categoryName = (goal.categories?.name || '').toLowerCase()
        const isRelevant = categoryName.includes('health') || categoryName.includes('fitness')
        
        console.log('[v0] Goal check:', { title: goal.title, category: goal.categories?.name, isRelevant })
        return isRelevant
      })

      console.log('[v0] loadFitnessGoals - filtered goals count:', fitnessGoals.length)
      
      // Calculate progress for each goal
      const progressMap: Record<string, any> = {}
      for (const goal of fitnessGoals) {
        const { data: goalLogs } = await supabase
          .from('fitness_logs')
          .select('amount')
          .eq('user_id', user.id)
          .eq('goal_id', goal.id)
        
        const totalCompleted = goalLogs?.reduce((sum, log) => sum + (log.amount || 0), 0) || 0
        progressMap[goal.id] = {
          completed: totalCompleted,
          target: goal.target_count || 0,
          percentage: goal.target_count ? Math.min((totalCompleted / goal.target_count) * 100, 100) : 0
        }
      }
      
      setGoalProgress(progressMap)
      setFitnessGoals(fitnessGoals)
    } catch (error) {
      console.error('Error loading fitness goals:', error)
    }
  }

  const handleGoalSelect = async (goalId: string, amount: string) => {
    if (!user || !selectedDate || !amount) return

    const dateStr = selectedDate.toISOString().split('T')[0]
    const numAmount = parseInt(amount, 10)

    if (isNaN(numAmount) || numAmount <= 0) return

    try {
      // Create fitness log with linked goal and amount
      const { error } = await supabase.from('fitness_logs').insert({
        user_id: user.id,
        logged_date: dateStr,
        goal_id: goalId,
        amount: numAmount,
      })

      if (error) throw error

      // Reload data and clear dialog
      loadFitnessData()
      loadFitnessGoals()
      setShowGoalDialog(false)
      setSelectedDate(null)
      setGoalInputs({})
    } catch (error) {
      console.error('Error saving fitness activity:', error)
    }
  }

  const calculateStreak = (logDatesArray: string[]) => {
    if (logDatesArray.length === 0) return 0
    
    // Sort dates in descending order (most recent first)
    const sortedDates = [...logDatesArray].sort((a, b) => b.localeCompare(a))
    
    // Start from the most recent logged date
    let currentStreak = 1
    let prevDate = new Date(sortedDates[0])
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i])
      
      // Calculate difference in days
      const diffTime = prevDate.getTime() - currentDate.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        // Consecutive day
        currentStreak++
        prevDate = currentDate
      } else {
        // Gap found, stop counting
        break
      }
    }
    
    return currentStreak
  }

  const logWorkout = async (date: Date) => {
    if (!user) return

    const dateStr = date.toISOString().split('T')[0]
    const existingLog = logs.find((log) => log.logged_date === dateStr)

    if (existingLog) {
      // Delete if already logged (toggle off)
      await supabase.from('fitness_logs').delete().eq('id', existingLog.id)
    } else {
      // Create new log
      await supabase.from('fitness_logs').insert({
        user_id: user.id,
        logged_date: dateStr,
      })
    }

    // Reload data (streak will be recalculated client-side)
    loadFitnessData()
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isLoggedOn = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0]
    return logs.some((log) => log.logged_date === dateStr)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const logged = isLoggedOn(day)
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      days.push(
        <button
          key={day}
          onClick={() => logWorkout(date)}
          onDoubleClick={() => {
            setSelectedDate(date)
            setShowGoalDialog(true)
          }}
          className={`aspect-square rounded-full transition-all ${
            logged
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-lg hover:shadow-xl hover:scale-110'
              : 'bg-muted text-muted-foreground hover:bg-muted hover:scale-105'
          }`}
          title="Double-click to link to a fitness goal"
        >
          <span className="text-sm font-medium">{day}</span>
        </button>
      )
    }

    return days
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          <p className="text-muted-foreground">Log your daily workouts and build streaks</p>
        </div>
        <Link href="/fitness/leaderboard">
          <Button variant="outline" size="lg">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{streak}</div>
            <p className="text-sm text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Workouts This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{logs.length}</div>
            <p className="text-sm text-muted-foreground">days logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Current Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{ranking ? `#${ranking}` : '-'}</div>
            <p className="text-sm text-muted-foreground">on leaderboard</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workout Calendar</CardTitle>
              <CardDescription>Click a day to log your workout</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prev = new Date(currentMonth)
                  prev.setMonth(prev.getMonth() - 1)
                  setCurrentMonth(prev)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="w-32 text-center font-semibold">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = new Date(currentMonth)
                  next.setMonth(next.getMonth() + 1)
                  setCurrentMonth(next)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Fast ways to log your workout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const today = new Date()
                logWorkout(today)
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Log Today
            </Button>
            <Button variant="outline">View History</Button>
          </div>
        </CardContent>
      </Card>

      {/* Goal Selection Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Link Fitness Activity to Goal</DialogTitle>
            <DialogDescription>
              Select a fitness goal for {selectedDate?.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {fitnessGoals.length > 0 ? (
              fitnessGoals.map((goal) => {
                const progress = goalProgress[goal.id] || { completed: 0, target: 0, percentage: 0 }
                return (
                  <Card key={goal.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-base">{goal.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {progress.completed} / {progress.target}
                          </p>
                        </div>
                        <Progress value={progress.percentage} className="h-2" />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Amount (e.g., 100)"
                            value={goalInputs[goal.id] || ''}
                            onChange={(e) =>
                              setGoalInputs({ ...goalInputs, [goal.id]: e.target.value })
                            }
                            className="flex-1 px-2 py-1 border rounded text-sm"
                            min="1"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleGoalSelect(goal.id, goalInputs[goal.id] || '0')}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Log
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No active fitness goals. Create a Health or Fitness category goal to get started.
              </div>
            )}
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowGoalDialog(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

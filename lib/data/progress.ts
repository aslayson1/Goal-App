import { supabase } from "@/lib/supabase/client"

export type ProgressRow = {
  id: string
  user_id: string
  date: string
  goals_completed: number
  tasks_completed: number
  total_goals: number
  total_tasks: number
  overall_progress: number
  created_at: string
}

export async function getProgressForDate(date: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("progress_tracking")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", date)
    .single()

  if (error && error.code !== "PGRST116") throw error // PGRST116 is "not found"
  return data as ProgressRow | null
}

export async function updateDailyProgress(date: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Calculate current progress
  const [goalsData, tasksData] = await Promise.all([
    supabase.from("goals").select("*").eq("user_id", user.id),
    supabase.from("tasks").select("*").eq("user_id", user.id),
  ])

  if (goalsData.error) throw goalsData.error
  if (tasksData.error) throw tasksData.error

  const goals = goalsData.data || []
  const tasks = tasksData.data || []

  const goalsCompleted = goals.filter((g) => g.current_count >= g.target_count).length
  const tasksCompleted = tasks.filter((t) => t.completed).length
  const totalGoals = goals.length
  const totalTasks = tasks.length

  const overallProgress = totalGoals > 0 ? (goalsCompleted / totalGoals) * 100 : 0

  const progressData = {
    user_id: user.id,
    date,
    goals_completed: goalsCompleted,
    tasks_completed: tasksCompleted,
    total_goals: totalGoals,
    total_tasks: totalTasks,
    overall_progress: overallProgress,
  }

  const { data, error } = await supabase
    .from("progress_tracking")
    .upsert([progressData], { onConflict: "user_id,date" })
    .select()
    .single()

  if (error) throw error
  return data as ProgressRow
}

export async function getProgressHistory(days = 30) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("progress_tracking")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(days)

  if (error) throw error
  return data as ProgressRow[]
}

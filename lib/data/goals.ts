import { supabase } from "@/lib/supabase/client"

export interface Goal {
  id: string
  user_id: string
  category_id: string | null
  title: string
  description: string | null
  target_count: number
  weekly_target: number
  current_progress: number
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export async function getGoals(): Promise<Goal[]> {
  const { data, error } = await supabase.from("goals").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function createGoal(goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">): Promise<Goal> {
  const { data, error } = await supabase.from("goals").insert(goal).select().single()

  if (error) throw error
  return data
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
  const { error } = await supabase
    .from("goals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
}

export async function updateGoalProgress(id: string, progress: number): Promise<void> {
  const completed = progress >= 100
  const { error } = await supabase
    .from("goals")
    .update({
      current_progress: progress,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from("goals").delete().eq("id", id)

  if (error) throw error
}

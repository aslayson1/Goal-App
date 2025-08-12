import { supabase } from "@/lib/supabase/client"

export interface LongTermGoal {
  id: string
  user_id: string
  title: string
  description: string | null
  goal_type: "1_year" | "5_year"
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export async function getLongTermGoals(goalType?: "1_year" | "5_year"): Promise<LongTermGoal[]> {
  let query = supabase.from("long_term_goals").select("*").order("created_at", { ascending: false })

  if (goalType) {
    query = query.eq("goal_type", goalType)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function createLongTermGoal(
  goal: Omit<LongTermGoal, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<LongTermGoal> {
  const { data, error } = await supabase.from("long_term_goals").insert(goal).select().single()

  if (error) throw error
  return data
}

export async function updateLongTermGoal(id: string, updates: Partial<LongTermGoal>): Promise<void> {
  const { error } = await supabase
    .from("long_term_goals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
}

export async function toggleLongTermGoalCompletion(id: string, completed: boolean): Promise<void> {
  const { error } = await supabase
    .from("long_term_goals")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error
}

export async function deleteLongTermGoal(id: string): Promise<void> {
  const { error } = await supabase.from("long_term_goals").delete().eq("id", id)

  if (error) throw error
}

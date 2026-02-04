import { supabase } from "@/lib/supabase/client"

export interface LongTermGoal {
  id: string
  user_id: string
  agent_id?: string
  title: string
  description: string | null
  goal_type: "1_year" | "3_year" | "5_year"
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
  target_count?: number
  daily_target?: number
  weekly_target?: number
  current_progress?: number
}

export async function getLongTermGoals(goalType?: "1_year" | "5_year"): Promise<LongTermGoal[]> {
  try {
    let query = supabase.from("long_term_goals").select("*").order("created_at", { ascending: false })

    if (goalType) {
      query = query.eq("goal_type", goalType)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Long term goals table not found, returning empty array")
      return []
    }
    throw error
  }
}

export async function createLongTermGoal(
  goal: Omit<LongTermGoal, "id" | "created_at" | "updated_at">,
): Promise<LongTermGoal | null> {
  try {
    const { data, error } = await supabase
      .from("long_term_goals")
      .insert({
        title: goal.title,
        description: goal.description,
        goal_type: goal.goal_type,
        completed: goal.completed,
        completed_at: goal.completed_at,
        target_count: goal.target_count,
        daily_target: goal.daily_target,
        weekly_target: goal.weekly_target,
        current_progress: goal.current_progress,
        agent_id: goal.agent_id,
        // Note: user_id is automatically set by Supabase RLS policy to auth.uid()
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error creating goal:", error.message, error.details)
      return null
    }

    console.log("[v0] Goal created successfully:", data?.id)
    return data
  } catch (error: any) {
    console.error("[v0] Exception creating goal:", error.message)
    return null
  }
}

export async function updateLongTermGoal(id: string, updates: Partial<LongTermGoal>): Promise<void> {
  try {
    const { error } = await supabase
      .from("long_term_goals")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (error) throw error
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Long term goals table not found, skipping database operation")
      return
    }
    throw error
  }
}

export async function toggleLongTermGoalCompletion(id: string, completed: boolean): Promise<void> {
  try {
    const { error } = await supabase
      .from("long_term_goals")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
    if (error) throw error
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Long term goals table not found, skipping database operation")
      return
    }
    throw error
  }
}

export async function deleteLongTermGoal(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("long_term_goals").delete().eq("id", id)
    if (error) throw error
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Long term goals table not found, skipping database operation")
      return
    }
    throw error
  }
}

import { supabase } from "@/lib/supabase/client"

export type GoalRow = {
  id: string
  user_id: string
  title: string
  description?: string | null
  target_date?: string | null
  status: "in_progress" | "completed" | "archived"
  category_id?: string | null
  created_at: string
  updated_at: string
}

export async function listGoals() {
  const { data, error } = await supabase.from("goals").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data as GoalRow[]
}

export async function createGoal(partial: {
  title: string
  description?: string | null
  target_date?: string | null
  category_id?: string | null
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("goals")
    .insert([{ user_id: user.id, status: "in_progress", ...partial }])
    .select()
    .single()
  if (error) throw error

  await supabase.from("goal_events").insert([
    {
      goal_id: data.id,
      user_id: user.id,
      event_type: "created",
      event_data: data,
    },
  ])

  return data as GoalRow
}

export async function completeGoal(goalId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("goals")
    .update({ status: "completed" })
    .eq("id", goalId)
    .select()
    .single()
  if (error) throw error

  await supabase.from("goal_events").insert([
    {
      goal_id: goalId,
      user_id: user.id,
      event_type: "completed",
      event_data: { status: "completed" },
    },
  ])

  return data as GoalRow
}

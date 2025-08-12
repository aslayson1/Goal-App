import { supabase } from "@/lib/supabase/client"

export type LongTermGoalRow = {
  id: string
  user_id: string
  category_id?: string | null
  title: string
  description?: string | null
  target_date?: string | null
  timeframe: "1-year" | "5-year"
  status: "in-progress" | "completed" | "on-hold"
  notes?: string | null
  created_at: string
  updated_at: string
}

export type MilestoneRow = {
  id: string
  goal_id: string
  title: string
  target_date?: string | null
  completed: boolean
  completed_at?: string | null
  created_at: string
  updated_at: string
}

export async function listLongTermGoals(timeframe?: "1-year" | "5-year") {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  let query = supabase
    .from("long_term_goals")
    .select(`
      *,
      categories(name, color),
      milestones(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (timeframe) {
    query = query.eq("timeframe", timeframe)
  }

  const { data, error } = await query
  if (error) throw error
  return data as (LongTermGoalRow & { milestones: MilestoneRow[] })[]
}

export async function createLongTermGoal(params: {
  title: string
  description?: string
  targetDate?: string
  timeframe: "1-year" | "5-year"
  category?: string
  notes?: string
  milestones?: { title: string; targetDate?: string }[]
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Get category_id if category name provided
  let category_id = null
  if (params.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", params.category)
      .single()
    category_id = categoryData?.id || null
  }

  const goalData = {
    user_id: user.id,
    category_id,
    title: params.title,
    description: params.description || null,
    target_date: params.targetDate || null,
    timeframe: params.timeframe,
    status: "in-progress" as const,
    notes: params.notes || null,
  }

  const { data: goal, error: goalError } = await supabase.from("long_term_goals").insert([goalData]).select().single()

  if (goalError) throw goalError

  // Create milestones if provided
  if (params.milestones && params.milestones.length > 0) {
    const milestoneData = params.milestones.map((milestone) => ({
      goal_id: goal.id,
      title: milestone.title,
      target_date: milestone.targetDate || null,
      completed: false,
    }))

    const { error: milestoneError } = await supabase.from("milestones").insert(milestoneData)

    if (milestoneError) throw milestoneError
  }

  return goal as LongTermGoalRow
}

export async function updateLongTermGoal(id: string, updates: Partial<LongTermGoalRow>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("long_term_goals")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data as LongTermGoalRow
}

export async function deleteLongTermGoal(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("long_term_goals").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error
}

export async function toggleMilestone(id: string, completed: boolean) {
  const { data, error } = await supabase
    .from("milestones")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as MilestoneRow
}

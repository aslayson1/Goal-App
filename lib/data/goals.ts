import { supabase } from "@/lib/supabase/client"

export type GoalRow = {
  id: string
  user_id: string
  category_id?: string | null
  title: string
  description?: string | null
  target_count: number
  current_count: number
  weekly_target: number
  notes?: string | null
  created_at: string
  updated_at: string
}

export async function listGoals() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("goals")
    .select(`
      *,
      categories(name, color)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as GoalRow[]
}

export async function createGoal(params: {
  title: string
  description?: string
  targetCount: number
  weeklyTarget?: number
  category?: string
  notes?: string
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
    target_count: params.targetCount,
    current_count: 0,
    weekly_target: params.weeklyTarget || 0,
    notes: params.notes || null,
  }

  const { data, error } = await supabase.from("goals").insert([goalData]).select().single()

  if (error) throw error
  return data as GoalRow
}

export async function updateGoalProgress(id: string, currentCount: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("goals")
    .update({ current_count: currentCount })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data as GoalRow
}

export async function updateGoal(id: string, updates: Partial<GoalRow>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data as GoalRow
}

export async function deleteGoal(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error
}

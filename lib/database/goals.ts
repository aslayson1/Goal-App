import { createClient } from "@/lib/supabase/server"

export interface Goal {
  id: string
  title: string
  description: string
  target_count: number
  current_progress: number
  weekly_target: number
  completed: boolean
  completed_at: string | null
  category_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  color: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string
  task_type: string
  completed: boolean
  completed_at: string | null
  target_date: string | null
  goal_id: string | null
  category_id: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export interface LongTermGoal {
  id: string
  title: string
  description: string
  goal_type: string
  completed: boolean
  completed_at: string | null
  user_id: string
  created_at: string
  updated_at: string
}

export async function getGoals(userId: string): Promise<Goal[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching goals:", error)
    return []
  }

  return data || []
}

export async function getCategories(userId: string): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function getTasks(userId: string): Promise<Task[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tasks:", error)
    return []
  }

  return data || []
}

export async function getLongTermGoals(userId: string): Promise<LongTermGoal[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("long_term_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching long term goals:", error)
    return []
  }

  return data || []
}

export async function createGoal(goal: Omit<Goal, "id" | "created_at" | "updated_at">): Promise<Goal | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("goals").insert(goal).select().single()

  if (error) {
    console.error("Error creating goal:", error)
    return null
  }

  return data
}

export async function createCategory(
  category: Omit<Category, "id" | "created_at" | "updated_at">,
): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").insert(category).select().single()

  if (error) {
    console.error("Error creating category:", error)
    return null
  }

  return data
}

export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("tasks").insert(task).select().single()

  if (error) {
    console.error("Error creating task:", error)
    return null
  }

  return data
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("goals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating goal:", error)
    return null
  }

  return data
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating task:", error)
    return null
  }

  return data
}

export async function deleteGoal(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("goals").delete().eq("id", id)

  if (error) {
    console.error("Error deleting goal:", error)
    return false
  }

  return true
}

export async function deleteTask(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("tasks").delete().eq("id", id)

  if (error) {
    console.error("Error deleting task:", error)
    return false
  }

  return true
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    return false
  }

  return true
}

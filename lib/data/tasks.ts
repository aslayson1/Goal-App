import { supabase } from "@/lib/supabase/client"

export type TaskRow = {
  id: string
  user_id: string
  category_id?: string | null
  goal_id?: string | null
  title: string
  description?: string | null
  task_type: "daily" | "weekly"
  target_date?: string | null
  day_of_week?: string | null
  time_block?: string | null
  priority: "low" | "medium" | "high"
  estimated_hours?: number | null
  estimated_minutes?: number | null
  completed: boolean
  completed_at?: string | null
  created_at: string
  updated_at: string
}

export async function createTask(params: {
  title: string
  description?: string
  category?: string
  goalId?: string
  taskType: "daily" | "weekly"
  targetDate?: string
  dayOfWeek?: string
  timeBlock?: string
  priority?: "low" | "medium" | "high"
  estimatedHours?: number
  estimatedMinutes?: number
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

  const taskData = {
    user_id: user.id,
    category_id,
    goal_id: params.goalId || null,
    title: params.title,
    description: params.description || null,
    task_type: params.taskType,
    target_date: params.targetDate || null,
    day_of_week: params.dayOfWeek || null,
    time_block: params.timeBlock || null,
    priority: params.priority || "medium",
    estimated_hours: params.estimatedHours || null,
    estimated_minutes: params.estimatedMinutes || null,
    completed: false,
  }

  const { data, error } = await supabase.from("tasks").insert([taskData]).select().single()

  if (error) throw error
  return data as TaskRow
}

export async function toggleTaskCompleted(id: string, completed: boolean) {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as TaskRow
}

export async function listTasks(filters?: {
  taskType?: "daily" | "weekly"
  dayOfWeek?: string
  targetDate?: string
  completed?: boolean
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  let query = supabase
    .from("tasks")
    .select(`
      *,
      categories(name, color),
      goals(title)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (filters?.taskType) {
    query = query.eq("task_type", filters.taskType)
  }
  if (filters?.dayOfWeek) {
    query = query.eq("day_of_week", filters.dayOfWeek)
  }
  if (filters?.targetDate) {
    query = query.eq("target_date", filters.targetDate)
  }
  if (filters?.completed !== undefined) {
    query = query.eq("completed", filters.completed)
  }

  const { data, error } = await query
  if (error) throw error
  return data as TaskRow[]
}

export async function deleteTask(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error
}

export async function updateTask(id: string, updates: Partial<TaskRow>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data as TaskRow
}

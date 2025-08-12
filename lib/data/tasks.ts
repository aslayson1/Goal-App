import { supabase } from "@/lib/supabase/client"

export type TaskRow = {
  id: string
  user_id: string
  title: string
  description?: string | null
  target_date?: string | null
  completed_at?: string | null // Use completed_at instead of completed boolean
  category_id?: string | null
  task_type?: string | null
  created_at: string
  updated_at: string
}

export async function createTask(row: {
  title: string
  description?: string | null
  target_date?: string | null
  category_id?: string | null
  task_type?: string | null
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: user.id,
          completed_at: null, // Use completed_at: null instead of completed: false
          ...row,
        },
      ])
      .select()
      .single()
    if (error) throw error
    return data as TaskRow
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Tasks table not found, skipping database operation")
      return null
    }
    throw error
  }
}

export async function setTaskCompleted(id: string, completed: boolean) {
  try {
    const updateData: any = {}
    if (completed) {
      updateData.completed_at = new Date().toISOString()
    } else {
      updateData.completed_at = null
    }

    const { data, error } = await supabase.from("tasks").update(updateData).eq("id", id).select().single()
    if (error) throw error
    return data as TaskRow
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Tasks table not found, skipping database operation")
      return null
    }
    throw error
  }
}

export async function listTasks(): Promise<TaskRow[]> {
  try {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data || []
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Tasks table not found, returning empty array")
      return []
    }
    throw error
  }
}

import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export type TaskRow = {
  id: string
  user_id: string
  title: string
  description?: string | null
  target_date?: string | null
  completed: boolean
  goal_id?: string | null
  task_type?: string | null
  created_at: string
  updated_at: string
}

export async function createTaskClient(
  row: {
    title: string
    description?: string | null
    target_date?: string | null
    goal_id?: string | null
    task_type?: string | null
  },
  userId: string,
): Promise<TaskRow | null> {
  const supabase = createSupabaseBrowserClient()

  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          user_id: userId,
          completed: false,
          ...row,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data as TaskRow
  } catch (error: any) {
    console.error("Create task error:", error)
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Tasks table not found, skipping database operation")
      return null
    }
    throw error
  }
}

export async function setTaskCompletedClient(id: string, completed: boolean): Promise<TaskRow | null> {
  const supabase = createSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("tasks").update({ completed }).eq("id", id).select().single()

    if (error) throw error
    return data as TaskRow
  } catch (error: any) {
    console.error("Update task error:", error)
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Tasks table not found, skipping database operation")
      return null
    }
    throw error
  }
}

export async function listTasksClient(): Promise<TaskRow[]> {
  const supabase = createSupabaseBrowserClient()

  try {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error: any) {
    console.error("List tasks error:", error)
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Tasks table not found, returning empty array")
      return []
    }
    return []
  }
}

import { supabase } from "@/lib/supabase/client"

export type TaskRow = {
  id: string
  user_id: string
  title: string
  description?: string | null
  due_date?: string | null
  status: "pending" | "completed"
  goal_id?: string | null
  created_at: string
  updated_at: string
}

export async function createTask(row: {
  title: string
  description?: string | null
  due_date?: string | null
  goal_id?: string | null
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ user_id: user.id, status: "pending", ...row }])
    .select()
    .single()
  if (error) throw error
  return data as TaskRow
}

export async function setTaskCompleted(id: string, completed: boolean) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status: completed ? "completed" : "pending" })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as TaskRow
}

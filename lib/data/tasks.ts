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

export async function listTasks(filter?: { day?: string; weekStart?: string; weekEnd?: string }) {
  let q = supabase.from("tasks").select("*").order("created_at", { ascending: false })
  if (filter?.day) q = q.eq("due_date", filter.day)
  if (filter?.weekStart && filter?.weekEnd) q = q.gte("due_date", filter.weekStart).lte("due_date", filter.weekEnd)
  const { data, error } = await q
  if (error) throw error
  return data as TaskRow[]
}

export async function createTask(partial: {
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
    .insert([{ user_id: user.id, status: "pending", ...partial }])
    .select()
    .single()
  if (error) throw error

  await supabase.from("task_events").insert([
    {
      task_id: data.id,
      user_id: user.id,
      event_type: "created",
      event_data: data,
    },
  ])

  return data as TaskRow
}

export async function toggleTaskCompleted(taskId: string, completed: boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")
  const newStatus = completed ? "completed" : "pending"

  const { data, error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId).select().single()
  if (error) throw error

  await supabase.from("task_events").insert([
    {
      task_id: taskId,
      user_id: user.id,
      event_type: completed ? "completed" : "updated",
      event_data: { status: newStatus },
    },
  ])

  return data as TaskRow
}

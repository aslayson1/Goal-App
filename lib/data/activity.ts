import { supabase } from "@/lib/supabase/client"

export type ActivityRow = {
  id: string
  user_id: string
  action_type: string
  entity_type: string
  entity_id?: string | null
  details?: any
  created_at: string
}

export async function logActivity(params: {
  actionType: string
  entityType: string
  entityId?: string
  details?: any
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return // Don't throw error for activity logging

  const activityData = {
    user_id: user.id,
    action_type: params.actionType,
    entity_type: params.entityType,
    entity_id: params.entityId || null,
    details: params.details || null,
  }

  const { error } = await supabase.from("activity_log").insert([activityData])

  // Don't throw errors for activity logging to avoid breaking main functionality
  if (error) console.warn("Failed to log activity:", error)
}

export async function getRecentActivity(limit = 50) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as ActivityRow[]
}

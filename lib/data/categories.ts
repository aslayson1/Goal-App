import { supabase } from "@/lib/supabase/client"

export type CategoryRow = {
  id: string
  user_id: string
  name: string
  color?: string | null
  created_at: string
  updated_at: string
}

export async function listCategories() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  if (error) throw error
  return data as CategoryRow[]
}

export async function createCategory(params: {
  name: string
  color?: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const categoryData = {
    user_id: user.id,
    name: params.name,
    color: params.color || null,
  }

  const { data, error } = await supabase.from("categories").insert([categoryData]).select().single()

  if (error) throw error
  return data as CategoryRow
}

export async function updateCategory(id: string, updates: { name?: string; color?: string }) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error
  return data as CategoryRow
}

export async function deleteCategory(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", user.id)

  if (error) throw error
}

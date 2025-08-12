import { supabase } from "@/lib/supabase/client"

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) throw error
  return data || []
}

export async function createCategory(name: string, color = "#3B82F6"): Promise<Category> {
  const { data, error } = await supabase.from("categories").insert({ name, color }).select().single()

  if (error) throw error
  return data
}

export async function updateCategory(id: string, updates: Partial<Pick<Category, "name" | "color">>): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) throw error
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) throw error
}

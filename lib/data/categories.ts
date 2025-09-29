import { createClient } from "@/lib/supabase/client"

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("categories").select("*").order("name")
    if (error) throw error
    return data || []
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Categories table not found, returning empty array")
      return []
    }
    throw error
  }
}

export async function createCategory(name: string, color = "#3B82F6"): Promise<Category | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("categories").insert({ name, color }).select().single()
    if (error) throw error
    return data
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Categories table not found, skipping database operation")
      return null
    }
    throw error
  }
}

export async function updateCategory(id: string, updates: Partial<Pick<Category, "name" | "color">>): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from("categories")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (error) throw error
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Categories table not found, skipping database operation")
      return
    }
    throw error
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("categories").delete().eq("id", id)
    if (error) throw error
  } catch (error: any) {
    if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
      console.warn("Categories table not found, skipping database operation")
      return
    }
    throw error
  }
}

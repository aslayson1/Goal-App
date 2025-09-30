"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addCategory(name: string, color = "#05a7b0") {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Insert the category
    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          user_id: user.id,
          name: name,
          color: color,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error inserting category:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")

    return { success: true, data }
  } catch (error) {
    console.error("Error adding category:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to add category" }
  }
}

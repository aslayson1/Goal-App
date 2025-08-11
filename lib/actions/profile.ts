"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface ProfileData {
  name: string
  email: string
  theme: string
  week_start_day: string
  timezone: string
  notifications: boolean
}

export async function updateProfile(prevState: any, formData: FormData) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: "User not authenticated" }
    }

    // Extract form data
    const profileData: ProfileData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      theme: formData.get("theme") as string,
      week_start_day: formData.get("week_start_day") as string,
      timezone: formData.get("timezone") as string,
      notifications: formData.get("notifications") === "true",
    }

    // Validate required fields
    if (!profileData.name || !profileData.email) {
      return { error: "Name and email are required" }
    }

    // Update or insert profile
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...profileData,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Profile update error:", error)
      return { error: "Failed to update profile" }
    }

    return { success: "Profile updated successfully" }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

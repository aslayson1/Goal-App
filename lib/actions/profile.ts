"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface ProfileData {
  name: string
  email: string
  theme: "light" | "dark" | "system"
  weekStartDay: "sunday" | "monday"
  timezone: string
  notifications: boolean
}

export async function updateUserProfile(profileData: ProfileData) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    // Update user metadata with profile information
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name: profileData.name,
        full_name: profileData.name,
        preferences: {
          theme: profileData.theme,
          weekStartDay: profileData.weekStartDay,
          timezone: profileData.timezone,
          notifications: profileData.notifications,
        },
      },
    })

    if (updateError) {
      console.error("Profile update error:", updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}

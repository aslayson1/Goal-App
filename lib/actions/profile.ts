"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

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
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
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

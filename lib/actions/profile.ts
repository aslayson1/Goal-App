"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export interface ProfileData {
  name: string
  email: string
  theme: "light" | "dark" | "system"
  weekStartDay: "sunday" | "monday"
  timezone: string
  notifications: boolean
  dashboardMode: "standard" | "12-week"
}

export async function updateUserProfile(profileData: ProfileData) {
  console.log("[v0] updateUserProfile called with:", profileData)

  try {
    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get("demo-user")

    console.log("[v0] Demo user cookie exists:", !!demoUserCookie)
    console.log("[v0] Demo user cookie value:", demoUserCookie?.value)

    if (demoUserCookie) {
      // Handle demo user profile update
      try {
        const demoUser = JSON.parse(demoUserCookie.value)
        console.log("[v0] Parsed demo user:", demoUser)

        const updatedDemoUser = {
          ...demoUser,
          name: profileData.name,
          email: profileData.email,
          preferences: {
            theme: profileData.theme,
            weekStartDay: profileData.weekStartDay,
            timezone: profileData.timezone,
            notifications: profileData.notifications,
            dashboardMode: profileData.dashboardMode,
          },
        }

        console.log("[v0] Updated demo user:", updatedDemoUser)

        cookieStore.set("demo-user", JSON.stringify(updatedDemoUser), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        console.log("[v0] Demo user profile updated successfully")
        return { success: true, message: "Profile updated successfully" }
      } catch (error) {
        console.error("[v0] Demo user profile update error:", error)
        return { success: false, error: "Failed to update demo user profile" }
      }
    }

    // Handle Supabase user profile update
    console.log("[v0] No demo user, checking Supabase auth")
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("[v0] Supabase user:", user)
    console.log("[v0] Supabase user error:", userError)

    if (userError || !user) {
      console.log("[v0] User not authenticated")
      return { success: false, error: "User not authenticated" }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name: profileData.name,
        full_name: profileData.name,
        preferences: {
          theme: profileData.theme,
          weekStartDay: profileData.weekStartDay,
          timezone: profileData.timezone,
          notifications: profileData.notifications,
          dashboardMode: profileData.dashboardMode,
        },
      },
    })

    if (updateError) {
      console.error("[v0] Profile update error:", updateError)
      return { success: false, error: updateError.message }
    }

    console.log("[v0] Supabase profile updated successfully")
    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    console.error("[v0] Profile update error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}

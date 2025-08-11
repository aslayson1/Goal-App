"use client"

export interface ProfileData {
  name: string
  email: string
  theme: "light" | "dark" | "system"
  weekStartDay: "sunday" | "monday"
  timezone: string
  notifications: boolean
}

export function updateUserProfile(profileData: ProfileData) {
  try {
    // Get current user from localStorage
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      throw new Error("User not authenticated")
    }

    const user = JSON.parse(storedUser)

    // Update user data with new profile information
    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      preferences: {
        theme: profileData.theme,
        weekStartDay: profileData.weekStartDay,
        timezone: profileData.timezone,
        notifications: profileData.notifications,
      },
    }

    // Save updated user back to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser))

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update profile" }
  }
}

"use server"

import { cookies } from "next/headers"
import { mockLogin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  if (email.toString() === "demo@example.com" && password.toString() === "password") {
    try {
      const user = await mockLogin(email.toString(), password.toString())
      const cookieStore = await cookies()
      cookieStore.set("demo-user", JSON.stringify(user), {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      return { success: true, isDemo: true }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/", "layout")

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const name = formData.get("name")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.toString(),
      password: password.toString(),
      email_confirm: true, // Pre-confirm the email
      user_metadata: {
        name: name?.toString() || email.toString().split("@")[0],
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Account created successfully! You can now sign in." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updatePassword(newPassword: string, userId: string) {
  try {
    console.log("[v0] Server action: updating password for user:", userId)
    
    // Import admin client to bypass RLS and session requirements
    const { createAdminClient } = await import("@/lib/supabase/admin")
    const adminClient = createAdminClient()

    if (!userId) {
      console.error("[v0] No user ID provided")
      return { error: "User ID is required to change password" }
    }

    // Use admin client to update user password by ID
    // This doesn't require an active session
    const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
      password: newPassword,
    })

    if (updateError) {
      console.error("[v0] Password update error:", updateError)
      return { error: updateError.message || "Failed to update password" }
    }

    console.log("[v0] Password updated successfully for user:", userId)
    revalidatePath("/", "layout")
    return { success: "Password updated successfully!" }
  } catch (error) {
    console.error("[v0] Error updating password:", error)
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    return { error: errorMessage }
  }
}

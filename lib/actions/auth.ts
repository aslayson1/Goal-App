"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = createSupabaseServerClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

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

  try {
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
        data: {
          name: name?.toString() || email.toString().split("@")[0],
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    if (data.user && !data.session) {
      return { success: "Please check your email to confirm your account before signing in." }
    }

    return { success: "Account created successfully! You can now sign in." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  try {
    const supabase = createSupabaseServerClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Sign out error:", error)
  }

  redirect("/login")
}

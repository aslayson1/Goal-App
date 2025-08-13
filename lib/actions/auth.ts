"use server"

import { cookies } from "next/headers"
import { mockLogin } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"

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
      const cookieStore = cookies()
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

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  try {
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

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

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

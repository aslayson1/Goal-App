"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createTaskAction(taskData: {
  title: string
  description?: string | null
  target_date: string
  task_type: string
  goal_id?: string | null
}) {
  const cookieStore = cookies()

  console.log("=== DEBUG: Task Creation Started ===")
  console.log("Task data:", taskData)

  const demoUserCookie = cookieStore.get("demo-user")?.value
  console.log("Demo user cookie:", demoUserCookie ? "Found" : "Not found")

  let userId: string
  let supabaseClient

  if (demoUserCookie) {
    try {
      const demoUser = JSON.parse(decodeURIComponent(demoUserCookie))
      userId = demoUser.id
      console.log("Using demo user with ID:", userId)

      supabaseClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: "", ...options })
            },
          },
        },
      )
    } catch (error) {
      console.error("Demo user parsing error:", error)
      throw new Error("Invalid demo user session")
    }
  } else {
    supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    console.log("Supabase user:", user ? `Found user: ${user.id}` : "No Supabase user")

    if (user) {
      userId = user.id
      console.log("Using Supabase auth with user ID:", userId)
    } else {
      console.error("No authentication found - no Supabase user and no demo user cookie")
      throw new Error("User not authenticated")
    }
  }

  console.log("Attempting database insert with user ID:", userId)

  const { data, error } = await supabaseClient
    .from("tasks")
    .insert({
      ...taskData,
      user_id: userId,
      completed: false,
    })
    .select()
    .single()

  if (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to create task: ${error.message}`)
  }

  console.log("Task created successfully:", data)
  console.log("=== DEBUG: Task Creation Completed ===")

  return data
}

export async function fetchTasksAction() {
  const cookieStore = cookies()

  const demoUserCookie = cookieStore.get("demo-user")?.value
  console.log("Demo user cookie:", demoUserCookie ? "Found" : "Not found")

  let userId: string
  let supabaseClient

  if (demoUserCookie) {
    try {
      const demoUser = JSON.parse(decodeURIComponent(demoUserCookie))
      userId = demoUser.id
      console.log("Using demo user with ID:", userId)

      supabaseClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: "", ...options })
            },
          },
        },
      )
    } catch (error) {
      return []
    }
  } else {
    supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    console.log("Supabase user:", user ? `Found user: ${user.id}` : "No Supabase user")

    if (user) {
      userId = user.id
    } else {
      return []
    }
  }

  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to fetch tasks: ${error.message}`)
  }

  return data || []
}

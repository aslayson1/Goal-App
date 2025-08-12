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

  // First try Supabase authentication
  const supabase = createServerClient(
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
  } = await supabase.auth.getUser()

  let userId: string
  let supabaseClient = supabase

  if (user) {
    userId = user.id
  } else {
    const demoUserCookie = cookieStore.get("demo-user")?.value
    if (demoUserCookie) {
      try {
        const demoUser = JSON.parse(decodeURIComponent(demoUserCookie))
        userId = demoUser.id

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
        throw new Error("Invalid demo user session")
      }
    } else {
      throw new Error("User not authenticated")
    }
  }

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

  return data
}

export async function fetchTasksAction() {
  const cookieStore = cookies()

  // First try Supabase authentication
  const supabase = createServerClient(
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
  } = await supabase.auth.getUser()

  let userId: string
  let supabaseClient = supabase

  if (user) {
    userId = user.id
  } else {
    const demoUserCookie = cookieStore.get("demo-user")?.value
    if (demoUserCookie) {
      try {
        const demoUser = JSON.parse(decodeURIComponent(demoUserCookie))
        userId = demoUser.id

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

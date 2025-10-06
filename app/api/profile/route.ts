import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, theme, weekStartDay, timezone, notifications, dashboardMode } = body

    console.log("[v0] Profile API called")

    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      console.log("[v0] No token provided")
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name,
        email,
        theme,
        week_start_day: weekStartDay,
        timezone,
        notifications,
        dashboard_mode: dashboardMode,
      },
    })

    if (updateError) {
      console.error("[v0] Profile update error:", updateError.message)

      if (updateError.message.includes("session") || updateError.message.includes("expired")) {
        return NextResponse.json({ error: "Authentication session expired. Please log in again." }, { status: 401 })
      }

      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    console.log("[v0] Profile updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Profile API error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

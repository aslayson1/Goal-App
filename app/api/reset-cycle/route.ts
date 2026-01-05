import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, startDate } = body

    console.log("[v0] Reset cycle API called for user:", userId)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: goalsData, error: goalsError } = await supabase
      .from("goals")
      .update({ current_progress: 0, completed: false })
      .eq("user_id", userId)

    console.log("[v0] Reset goals result - Error:", goalsError?.message, "Data:", goalsData)

    if (goalsError) {
      console.error("[v0] Error resetting goals:", goalsError.message)
      return NextResponse.json({ error: "Failed to reset goals", details: goalsError.message }, { status: 500 })
    }

    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .update({ completed: false, completed_at: null })
      .eq("user_id", userId)

    console.log("[v0] Reset tasks result - Error:", tasksError?.message, "Data:", tasksData)

    if (tasksError) {
      console.error("[v0] Error resetting tasks:", tasksError.message)
      return NextResponse.json({ error: "Failed to reset tasks", details: tasksError.message }, { status: 500 })
    }

    const { data: ltGoalsData, error: ltGoalsError } = await supabase
      .from("long_term_goals")
      .update({ completed: false, completed_at: null })
      .eq("user_id", userId)

    console.log("[v0] Reset long-term goals result - Error:", ltGoalsError?.message, "Data:", ltGoalsData)

    if (ltGoalsError) {
      console.error("[v0] Error resetting long-term goals:", ltGoalsError.message)
      return NextResponse.json(
        { error: "Failed to reset long-term goals", details: ltGoalsError.message },
        { status: 500 },
      )
    }

    console.log("[v0] Cycle reset successfully for user:", userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Reset cycle API error:", error)
    return NextResponse.json({ error: "Failed to reset cycle", details: String(error) }, { status: 500 })
  }
}

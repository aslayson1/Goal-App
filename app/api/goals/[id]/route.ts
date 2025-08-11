import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { completed, title }: { completed?: boolean; title?: string } = await req.json()
  const update: any = {}

  if (typeof completed === "boolean") {
    update.completed = completed
    update.completed_at = completed ? new Date().toISOString() : null
  }
  if (typeof title === "string") {
    update.title = title.trim()
  }

  const { error } = await supabase.from("goals").update(update).eq("id", params.id).eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { error } = await supabase.from("goals").delete().eq("id", params.id).eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

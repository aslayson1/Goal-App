import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createSupabaseServerClient()
  const { data, error } = (await supabase.from("pg_tables").select("schemaname").limit(1)) as any
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

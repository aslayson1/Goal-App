import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const envSummary = {
    hasUrl: !!url,
    hasAnon: !!anon,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "missing",
  }

  const supa = createClient(url!, anon!)
  const authCheck = await supa.auth.getSession().catch((e) => ({ error: String(e?.message || e) }))

  let insertResult: any = "skipped - set TEST_TABLE env to run insert"
  if (process.env.TEST_TABLE) {
    const table = process.env.TEST_TABLE
    const payload = { _probe: "ok", created_at: new Date().toISOString() }
    insertResult = await supa
      .from(table)
      .insert(payload)
      .select()
      .catch((e) => ({ error: String(e?.message || e) }))
  }

  return NextResponse.json({ envSummary, authCheck, insertResult })
}

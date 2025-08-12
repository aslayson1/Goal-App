import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anon) {
      return NextResponse.json({
        error: "Missing Supabase environment variables",
        envSummary: { hasUrl: !!url, hasAnon: !!anon },
      })
    }

    const envSummary = {
      hasUrl: !!url,
      hasAnon: !!anon,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "missing",
      testTable: process.env.TEST_TABLE || "not set",
    }

    const supa = createClient(url, anon)
    const authCheck = await supa.auth.getSession().catch((e) => ({ error: String(e?.message || e) }))

    let insertResult: any = "skipped - set TEST_TABLE env to run insert"
    if (process.env.TEST_TABLE) {
      const table = process.env.TEST_TABLE
      const payload = {
        title: "Diagnostic Test",
        description: "Test from diagnostic API",
        target_date: new Date().toISOString().split("T")[0],
        completed: false,
        created_at: new Date().toISOString(),
      }
      insertResult = await supa
        .from(table)
        .insert(payload)
        .select()
        .catch((e) => ({ error: String(e?.message || e) }))
    }

    return NextResponse.json({
      status: "success",
      envSummary,
      authCheck,
      insertResult,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: String(error),
    })
  }
}

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anon) {
      return NextResponse.json({
        error: "Missing Supabase environment variables",
        envSummary: { hasUrl: !!url, hasAnon: !!anon, hasServiceKey: !!serviceKey },
      })
    }

    const supabase = createClient(url, anon)

    // Test auth endpoint
    const { data: authData, error: authError } = await supabase.auth.getSession()

    // Check if we can query users (this will tell us about RLS policies)
    const usersResponse = await fetch(`${url}/rest/v1/auth.users?select=email,created_at,email_confirmed_at&limit=5`, {
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        "Content-Type": "application/json",
      },
    })

    const usersTest = usersResponse.ok ? "accessible" : `blocked: ${usersResponse.status}`

    return NextResponse.json({
      status: "auth diagnostic complete",
      environment: {
        supabaseUrl: url,
        hasAnon: !!anon,
        hasServiceKey: !!serviceKey,
        anonKeyPrefix: anon.substring(0, 12),
      },
      authEndpoint: authError ? `error: ${authError.message}` : "accessible",
      usersTable: usersTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: String(error),
    })
  }
}

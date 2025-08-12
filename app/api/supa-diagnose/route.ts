import { NextResponse } from "next/server"

export const runtime = "nodejs"

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

    // Test basic connection with REST API
    const testResponse = await fetch(`${url}/rest/v1/tasks?select=count&limit=1`, {
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        "Content-Type": "application/json",
      },
    })

    const connectionTest = testResponse.ok ? "success" : `failed: ${testResponse.status}`

    // Test insert if TEST_TABLE is set
    let insertTest = "skipped - set TEST_TABLE=tasks to test"
    if (process.env.TEST_TABLE === "tasks") {
      const insertResponse = await fetch(`${url}/rest/v1/tasks`, {
        method: "POST",
        headers: {
          apikey: serviceKey || anon,
          Authorization: `Bearer ${serviceKey || anon}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          title: "Diagnostic Test",
          description: "Test from diagnostic API",
          target_date: new Date().toISOString().split("T")[0],
          completed: false,
        }),
      })

      if (insertResponse.ok) {
        const result = await insertResponse.json()
        insertTest = `success - inserted task with id: ${result[0]?.id}`
      } else {
        const error = await insertResponse.text()
        insertTest = `failed: ${insertResponse.status} - ${error}`
      }
    }

    return NextResponse.json({
      status: "diagnostic complete",
      connection: connectionTest,
      insertTest,
      envCheck: {
        hasUrl: !!url,
        hasAnon: !!anon,
        hasServiceKey: !!serviceKey,
        testTable: process.env.TEST_TABLE || "not set",
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: String(error),
    })
  }
}

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Middleware: Environment variables check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl || "missing",
    key: supabaseAnonKey ? "present" : "missing",
  })

  // This ensures session cookies are always processed
  try {
    const supabase = createServerClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-key",
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
          },
        },
      },
    )

    // Only call getUser if we have valid environment variables
    if (supabaseUrl && supabaseAnonKey) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      console.log("[v0] Middleware: Session check result:", {
        hasUser: !!user,
        userId: user?.id,
        error: error?.message,
      })
    } else {
      console.log("[v0] Middleware: Skipping session check due to missing env vars, but preserving cookies")
    }
  } catch (error) {
    console.error("[v0] Middleware: Error processing session:", error)
    // Return the response even if there's an error to prevent breaking the request
    return supabaseResponse
  }

  return supabaseResponse
}

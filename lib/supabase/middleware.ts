import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  try {
    // If environment variables are missing, just preserve cookies without creating Supabase client
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("[v0] Middleware: Environment variables missing, preserving cookies only")
      return supabaseResponse
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    })

    // Refresh the session to maintain authentication
    await supabase.auth.getUser()
  } catch (error) {
    console.error("[v0] Middleware: Error processing session:", error)
    // Always return response to prevent breaking the request flow
  }

  return supabaseResponse
}

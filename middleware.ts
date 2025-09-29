import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // The NEXT_PUBLIC_ vars are not available in process.env in middleware
  // We'll use the request headers to pass the URL from the client
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Middleware - checking env vars:", {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseAnonKey: !!supabaseAnonKey,
    supabaseUrlSource: process.env.SUPABASE_URL
      ? "SUPABASE_URL"
      : process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "NEXT_PUBLIC_SUPABASE_URL"
        : "none",
  })

  // If Supabase credentials are not available, skip auth check
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase credentials not found in middleware, skipping auth check")
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: "",
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value: "",
          ...options,
        })
      },
    },
  })

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    console.log("[v0] Middleware auth check:", { hasUser: !!user, error: error?.message })
  } catch (error) {
    console.error("[v0] Error in middleware auth check:", error)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

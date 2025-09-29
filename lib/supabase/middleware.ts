import { createClient } from "@/lib/supabase/client"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createClient()

    // Refresh session and get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    const isPublicRoute =
      pathname.startsWith("/login") ||
      pathname.startsWith("/auth") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon")

    const isProtectedRoute = !isPublicRoute

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(url)
    }

    if (user && pathname.startsWith("/login")) {
      const redirectTo = request.nextUrl.searchParams.get("redirectTo")
      const url = request.nextUrl.clone()
      url.pathname = redirectTo && redirectTo !== "/login" ? redirectTo : "/"
      url.searchParams.delete("redirectTo")
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error("Middleware auth error:", error)
    return supabaseResponse
  }
}

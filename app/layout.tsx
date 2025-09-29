import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goal Tracker",
  description: "Track and achieve your goals with our modern goal tracking application",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let initialUser = null
  try {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      initialUser = {
        id: user.id,
        email: user.email ?? null,
        name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
        avatar: user.user_metadata?.avatar_url ?? null,
      }
    }
  } catch (error) {
    console.error("Failed to get initial user session:", error)
    // Continue with null user - client will handle auth check
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider initialUser={initialUser}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

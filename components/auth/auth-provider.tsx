"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"

type User = { id: string; email?: string | null; name?: string | null; avatar?: string | null }

type AuthContextType = {
  user: User | null
  loading: boolean
  login: () => Promise<void>
  register: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuthState = async () => {
    try {
      console.log("[v0] Checking auth state...")

      // First check for demo user cookie
      const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))

      if (demoUserCookie) {
        const cookieValue = demoUserCookie.split("=")[1]
        if (cookieValue && cookieValue !== "") {
          try {
            const demoUserData = JSON.parse(decodeURIComponent(cookieValue))
            console.log("[v0] Found demo user:", demoUserData)
            setUser(demoUserData)
            setLoading(false)
            return
          } catch (parseError) {
            console.error("[v0] Failed to parse demo user cookie:", parseError)
            // Clear invalid cookie
            document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
          }
        }
      }

      // Check Supabase auth if no demo user
      const { data } = await supabase.auth.getUser()
      const u = data.user

      console.log("[v0] Supabase user data:", u)

      setUser(
        u
          ? {
              id: u.id,
              email: u.email ?? null,
              name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
            }
          : null,
      )
      setLoading(false)
    } catch (error) {
      console.error("[v0] Auth check error:", error)
      setUser(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthState()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change:", event, session?.user?.id)

      // Don't override demo user session
      const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))
      if (demoUserCookie) {
        console.log("[v0] Demo user active, ignoring Supabase auth change")
        return
      }

      const u = session?.user
      setUser(
        u
          ? {
              id: u.id,
              email: u.email ?? null,
              name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
            }
          : null,
      )
      setLoading(false)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    setLoading(true)
    try {
      console.log("[v0] Logging out...")
      // Clear demo user cookie
      document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      // Sign out from Supabase
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login: async () => {
      throw new Error("Use server actions for login")
    },
    register: async () => {
      throw new Error("Use server actions for register")
    },
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

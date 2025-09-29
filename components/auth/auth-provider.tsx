"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

type User = { id: string; email?: string | null; name?: string | null; avatar?: string | null }

type AuthContextType = {
  user: User | null
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const getInitialSession = async () => {
      try {
        const supabase = createClient()

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("[v0] AuthProvider: Session error:", sessionError)
        }

        if (mounted) {
          const userData = session?.user
            ? {
                id: session.user.id,
                email: session.user.email ?? null,
                name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? null,
              }
            : null

          console.log("[v0] AuthProvider: Setting user:", userData?.email || "null")
          setUser(userData)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("[v0] AuthProvider: Auth check error:", error)
        if (mounted) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    let subscription: any
    try {
      const supabase = createClient()
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return

        console.log("[v0] AuthProvider: Auth state change:", event, session?.user?.email || "no user")

        const userData = session?.user
          ? {
              id: session.user.id,
              email: session.user.email ?? null,
              name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? null,
            }
          : null

        setUser(userData)
        setIsLoading(false)
      })

      subscription = data.subscription
    } catch (error) {
      console.error("[v0] AuthProvider: Error setting up auth listener:", error)
      if (mounted) {
        setIsLoading(false)
      }
    }

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const logout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
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

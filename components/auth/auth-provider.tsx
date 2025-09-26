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
    const supabase = createClient()

    const getInitialSession = async () => {
      try {
        console.log("[v0] AuthProvider: Getting initial session...")
        const {
          data: { user: supabaseUser },
          error,
        } = await supabase.auth.getUser()

        console.log("[v0] AuthProvider: Initial session result:", {
          hasUser: !!supabaseUser,
          userId: supabaseUser?.id,
          error: error?.message,
        })

        if (mounted) {
          const userData = supabaseUser
            ? {
                id: supabaseUser.id,
                email: supabaseUser.email ?? null,
                name: supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null,
              }
            : null

          console.log("[v0] AuthProvider: Setting user:", userData)
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("[v0] AuthProvider: Auth state change:", {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
      })

      const supabaseUser = session?.user

      const userData = supabaseUser
        ? {
            id: supabaseUser.id,
            email: supabaseUser.email ?? null,
            name: supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null,
          }
        : null

      console.log("[v0] AuthProvider: Setting user from auth change:", userData)
      setUser(userData)
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
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

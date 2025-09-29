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
    let retryCount = 0
    const maxRetries = 3

    const getInitialSession = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user: supabaseUser },
          error,
        } = await supabase.auth.getUser()

        if (mounted) {
          const userData = supabaseUser
            ? {
                id: supabaseUser.id,
                email: supabaseUser.email ?? null,
                name: supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null,
              }
            : null

          setUser(userData)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("[v0] AuthProvider: Auth check error:", error)

        if (retryCount < maxRetries && mounted) {
          retryCount++
          console.log(`[v0] AuthProvider: Retrying auth check (${retryCount}/${maxRetries})`)
          setTimeout(() => getInitialSession(), 1000 * retryCount)
        } else if (mounted) {
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

        const supabaseUser = session?.user
        const userData = supabaseUser
          ? {
              id: supabaseUser.id,
              email: supabaseUser.email ?? null,
              name: supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null,
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

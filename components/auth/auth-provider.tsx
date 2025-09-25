"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"

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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.log("[v0] Session error:", error.message)
          setUser(null)
        } else if (session?.user) {
          const u = session.user
          console.log("[v0] Initial session found for:", u.email)
          setUser({
            id: u.id,
            email: u.email ?? null,
            name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
          })
        } else {
          console.log("[v0] No initial session found")
          setUser(null)
        }
      } catch (error) {
        console.error("[v0] Error getting initial session:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change event:", event)
      console.log("[v0] Session:", session ? "exists" : "null")

      if (session?.user) {
        const u = session.user
        setUser({
          id: u.id,
          email: u.email ?? null,
          name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
        })
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Logging out...")
      await supabase.auth.signOut()
      setUser(null)
      console.log("[v0] Logout successful")
    } catch (error) {
      console.error("[v0] Logout error:", error)
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

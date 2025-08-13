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
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("Initial session check:", { session: session?.user?.id, error })

        if (error) {
          console.error("Error getting session:", error)
          setUser(null)
        } else if (session?.user) {
          console.log("Found existing session for user:", session.user.email)
          setUser({
            id: session.user.id,
            email: session.user.email ?? null,
            name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? null,
          })
        } else {
          console.log("No existing session found")
          setUser(null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? null,
        })
      } else {
        setUser(null)
      }

      if (!isLoading) {
        setIsLoading(false)
      }
    })

    initializeAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [isLoading])

  const logout = async () => {
    console.log("Logging out user")
    await supabase.auth.signOut()
    setUser(null)
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

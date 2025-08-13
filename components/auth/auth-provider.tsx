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
  const [isInitialized, setIsInitialized] = useState(false)

  const checkAuthState = async () => {
    try {
      // First check for Supabase session
      const { data } = await supabase.auth.getUser()
      const supabaseUser = data.user

      if (supabaseUser) {
        // If we have a Supabase user, use that and clear any demo cookie
        document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          name: supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null,
        })
        setIsLoading(false)
        setIsInitialized(true)
        return
      }

      // Only check demo cookie if no Supabase user
      const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))
      if (demoUserCookie) {
        const cookieValue = demoUserCookie.split("=")[1]
        if (cookieValue && cookieValue !== "") {
          try {
            const decodedValue = decodeURIComponent(cookieValue)
            if (decodedValue && decodedValue.trim() !== "" && decodedValue !== "undefined") {
              const demoUserData = JSON.parse(decodedValue)
              if (demoUserData && typeof demoUserData === "object" && demoUserData.id) {
                setUser(demoUserData)
                setIsLoading(false)
                setIsInitialized(true)
                return
              }
            }
          } catch (parseError) {
            console.error("Failed to parse demo user cookie:", parseError)
            document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
          }
        }
      }

      // No user found
      setUser(null)
      setIsLoading(false)
      setIsInitialized(true)
    } catch (error) {
      console.error("Auth check error:", error)
      setUser(null)
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  useEffect(() => {
    checkAuthState()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event)
      const u = session?.user

      if (u) {
        // Clear demo cookie when Supabase user is active
        document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        setUser({
          id: u.id,
          email: u.email ?? null,
          name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
        })
      } else {
        // Only check demo cookie if no Supabase session
        const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))
        if (demoUserCookie) {
          try {
            const cookieValue = demoUserCookie.split("=")[1]
            const decodedValue = decodeURIComponent(cookieValue)
            const demoUserData = JSON.parse(decodedValue)
            if (demoUserData && demoUserData.id) {
              setUser(demoUserData)
            } else {
              setUser(null)
            }
          } catch {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }

      setIsLoading(false)
      setIsInitialized(true)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    setIsLoading(true)
    try {
      document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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

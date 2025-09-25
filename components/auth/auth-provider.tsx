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
      console.log("[v0] Checking auth state...")

      const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))

      if (demoUserCookie) {
        const cookieValue = demoUserCookie.split("=")[1]
        if (cookieValue && cookieValue !== "") {
          try {
            const demoUserData = JSON.parse(decodeURIComponent(cookieValue))
            console.log("[v0] Using demo user from cookie")
            setUser(demoUserData)
            setIsLoading(false)
            setIsInitialized(true)
            return
          } catch (parseError) {
            console.error("Failed to parse demo user cookie:", parseError)
            document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
          }
        }
      }

      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.log("[v0] Auth error:", error.message)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.log("[v0] Session error:", sessionError.message)
          setUser(null)
          setIsLoading(false)
          setIsInitialized(true)
          return
        }

        if (sessionData.session) {
          console.log("[v0] Session found, refreshing...")
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError) {
            console.log("[v0] Refresh error:", refreshError.message)
            setUser(null)
          } else {
            console.log("[v0] Session refreshed successfully")
            const u = refreshData.user
            setUser(
              u
                ? {
                    id: u.id,
                    email: u.email ?? null,
                    name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
                  }
                : null,
            )
          }
        } else {
          setUser(null)
        }
      } else {
        const u = data.user
        console.log("[v0] User found:", u?.email)
        setUser(
          u
            ? {
                id: u.id,
                email: u.email ?? null,
                name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
              }
            : null,
        )
      }

      setIsLoading(false)
      setIsInitialized(true)
    } catch (error) {
      console.error("[v0] Auth check error:", error)
      setUser(null)
      setIsLoading(false)
      setIsInitialized(true)
    }
  }

  useEffect(() => {
    const performInitialCheck = async () => {
      await checkAuthState()
      setTimeout(async () => {
        await checkAuthState()
      }, 50)
    }

    performInitialCheck()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change event:", event)
      console.log("[v0] Session:", session ? "exists" : "null")

      const u = session?.user

      if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        console.log("[v0] Handling auth event:", event)
      }

      setUser(
        u
          ? {
              id: u.id,
              email: u.email ?? null,
              name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
            }
          : null,
      )
      setIsLoading(false)
      setIsInitialized(true)

      if (u && !u.user_metadata?.name && !u.user_metadata?.full_name) {
        setTimeout(async () => {
          await checkAuthState()
        }, 1000)
      }
    })

    const handleFocus = () => {
      checkAuthState()
    }
    window.addEventListener("focus", handleFocus)

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthState()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    const handleStorageChange = () => {
      if (isInitialized) {
        checkAuthState()
      }
    }
    window.addEventListener("storage", handleStorageChange)

    let checkCount = 0
    const cookieCheckInterval = setInterval(() => {
      if (isInitialized) {
        checkAuthState()
        checkCount++
        if (checkCount > 5) {
          clearInterval(cookieCheckInterval)
          const slowInterval = setInterval(() => {
            if (isInitialized) {
              checkAuthState()
            }
          }, 10000)
          return () => clearInterval(slowInterval)
        }
      }
    }, 1000)

    return () => {
      sub.subscription.unsubscribe()
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(cookieCheckInterval)
    }
  }, [])

  const logout = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Logging out...")
      document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
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

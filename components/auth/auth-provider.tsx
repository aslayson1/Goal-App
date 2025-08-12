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
      const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))

      if (demoUserCookie) {
        const cookieValue = demoUserCookie.split("=")[1]
        if (cookieValue && cookieValue !== "") {
          try {
            const demoUserData = JSON.parse(decodeURIComponent(cookieValue))
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

      const { data } = await supabase.auth.getUser()
      const u = data.user
      setUser(u ? { id: u.id, email: u.email ?? null } : null)
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

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user
      setUser(u ? { id: u.id, email: u.email ?? null } : null)
      setIsLoading(false)
      setIsInitialized(true)
    })

    const handleFocus = () => {
      checkAuthState()
    }
    window.addEventListener("focus", handleFocus)

    const handleStorageChange = () => {
      if (isInitialized) {
        checkAuthState()
      }
    }
    window.addEventListener("storage", handleStorageChange)

    const cookieCheckInterval = setInterval(() => {
      if (isInitialized) {
        checkAuthState()
      }
    }, 2000)

    return () => {
      sub.subscription.unsubscribe()
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(cookieCheckInterval)
    }
  }, [isInitialized])

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
    isLoading: !isInitialized,
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

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

  const checkAuthState = async () => {
    try {
      // Check for demo user cookie first
      const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))

      if (demoUserCookie) {
        const demoUserData = JSON.parse(decodeURIComponent(demoUserCookie.split("=")[1]))
        setUser(demoUserData)
        setIsLoading(false)
        return
      }

      // Check Supabase auth
      const { data } = await supabase.auth.getUser()
      const u = data.user
      setUser(u ? { id: u.id, email: u.email ?? null } : null)
      setIsLoading(false)
    } catch (error) {
      console.error("Auth check error:", error)
      setUser(null)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuthState()

    // Listen for Supabase auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user
      setUser(u ? { id: u.id, email: u.email ?? null } : null)
      setIsLoading(false)
    })

    const handleStorageChange = () => {
      checkAuthState()
    }
    window.addEventListener("storage", handleStorageChange)

    const cookieCheckInterval = setInterval(checkAuthState, 1000)

    return () => {
      sub.subscription.unsubscribe()
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(cookieCheckInterval)
    }
  }, [])

  const logout = async () => {
    setIsLoading(true)
    try {
      // Clear demo user cookie
      document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

      // Sign out from Supabase
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

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
    let mounted = true

    const processAuthState = (session: any) => {
      if (!mounted) return

      if (session?.user) {
        document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          name: session.user.user_metadata?.name ?? session.user.user_metadata?.full_name ?? null,
        })
      } else {
        const demoUserCookie = document.cookie.split("; ").find((row) => row.startsWith("demo-user="))
        if (demoUserCookie) {
          try {
            const cookieValue = demoUserCookie.split("=")[1]
            if (cookieValue && cookieValue !== "") {
              const decodedValue = decodeURIComponent(cookieValue)
              if (decodedValue && decodedValue.trim() !== "" && decodedValue !== "undefined") {
                const demoUserData = JSON.parse(decodedValue)
                if (demoUserData && typeof demoUserData === "object" && demoUserData.id) {
                  setUser(demoUserData)
                } else {
                  setUser(null)
                }
              } else {
                setUser(null)
              }
            } else {
              setUser(null)
            }
          } catch (parseError) {
            console.error("Failed to parse demo user cookie:", parseError)
            document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
    }

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        processAuthState(session)

        if (mounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        if (mounted) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("Auth state change event:", event)
      processAuthState(session)
    })

    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
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

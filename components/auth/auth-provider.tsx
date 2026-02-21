"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"

type User = { 
  id: string
  email?: string | null
  name?: string | null
  avatar?: string | null
  companyLogo?: string | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: () => Promise<void>
  register: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
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
    let timeoutId: NodeJS.Timeout

    const getInitialSession = async () => {
      try {
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()

        if (mounted && supabaseUser) {
          const name = supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null

          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email ?? null,
            name,
            avatar: null,
            companyLogo: null,
          })
          setIsLoading(false)

          // Fetch profile data in background (don't block loading)
          supabase
            .from('profiles')
            .select('avatar_url, company_logo_url')
            .eq('id', supabaseUser.id)
            .maybeSingle()
            .then(({ data: profile, error }) => {
              if (mounted && profile) {
                setUser((prev) => prev ? {
                  ...prev,
                  avatar: profile.avatar_url ?? null,
                  companyLogo: profile.company_logo_url ?? null,
                } : null)
              }
              if (error) {
                console.error('[v0] Initial profile fetch error:', error)
              }
            })
            .catch((err) => {
              console.error('[v0] Initial profile fetch exception:', err)
            })
        } else if (mounted) {
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error)
        if (mounted) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      const supabaseUser = session?.user

      if (supabaseUser) {
        const name = supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          name,
          avatar: null,
          companyLogo: null,
        })

        // Fetch profile data in background (don't block)
        supabase
          .from('profiles')
          .select('avatar_url, company_logo_url')
          .eq('id', supabaseUser.id)
          .maybeSingle()
          .then(({ data: profile, error }) => {
            if (mounted && profile) {
              setUser((prev) => prev ? {
                ...prev,
                avatar: profile.avatar_url ?? null,
                companyLogo: profile.company_logo_url ?? null,
              } : null)
            }
            if (error) {
              console.error('[v0] Auth listener profile fetch error:', error)
            }
          })
          .catch((err) => {
            console.error('[v0] Auth listener profile fetch exception:', err)
          })
      } else {
        if (mounted) {
          setUser(null)
        }
      }

      if (mounted) {
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const refreshUser = async () => {
    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser()

      if (supabaseUser) {
        const name = supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          name,
          avatar: null,
          companyLogo: null,
        })

        // Fetch profile data in background
        supabase
          .from('profiles')
          .select('avatar_url, company_logo_url')
          .eq('id', supabaseUser.id)
          .maybeSingle()
          .then(({ data: profile, error }) => {
            if (profile) {
              setUser((prev) => prev ? {
                ...prev,
                avatar: profile.avatar_url ?? null,
                companyLogo: profile.company_logo_url ?? null,
              } : null)
            }
            if (error) {
              console.error('[v0] Profile refresh error:', error)
            }
          })
          .catch((err) => {
            console.error('[v0] Profile refresh exception:', err)
          })
      }
    } catch (error) {
      console.error("[v0] Error refreshing user:", error)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
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
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

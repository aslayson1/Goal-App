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

    const getInitialSession = async () => {
      try {
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()

        if (mounted && supabaseUser) {
          const name = supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null

          // Fetch profile data including avatar and logo
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('avatar_url, company_logo_url')
            .eq('id', supabaseUser.id)
            .single()

          if (profileError) {
            console.error('[v0] Initial profile fetch error:', profileError)
          }
          
          console.log('[v0] Initial profile load:', profile)

          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email ?? null,
            name,
            avatar: profile?.avatar_url ?? null,
            companyLogo: profile?.company_logo_url ?? null,
          })
          setIsLoading(false)
        } else if (mounted) {
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Auth check error:", error)
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

      const supabaseUser = session?.user

      if (supabaseUser) {
        const name = supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name ?? null

        // Fetch profile data including avatar and logo
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url, company_logo_url')
          .eq('id', supabaseUser.id)
          .single()

        if (profileError) {
          console.error('[v0] Auth listener profile fetch error:', profileError)
        }

        console.log('[v0] Auth listener profile load:', profile)

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          name,
          avatar: profile?.avatar_url ?? null,
          companyLogo: profile?.company_logo_url ?? null,
        })
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => {
      mounted = false
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

        // Fetch profile data including avatar and logo
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url, company_logo_url')
          .eq('id', supabaseUser.id)
          .single()

        if (profileError) {
          console.error('[v0] Profile fetch error:', profileError)
        }

        console.log('[v0] Refreshed user profile:', profile)

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          name,
          avatar: profile?.avatar_url ?? null,
          companyLogo: profile?.company_logo_url ?? null,
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

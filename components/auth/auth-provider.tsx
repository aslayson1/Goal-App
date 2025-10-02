"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
  const [user] = useState<User | null>({ id: "demo-user", email: "demo@example.com", name: "Demo User" })
  const [isLoading] = useState(false)

  const logout = async () => {
    console.log("Logout called (auth disabled)")
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login: async () => {
      console.log("Login called (auth disabled)")
    },
    register: async () => {
      console.log("Register called (auth disabled)")
    },
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

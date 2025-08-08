'use client'

import { useState, useEffect, createContext, useContext, ReactNode, createElement } from 'react'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  preferences: {
    theme: 'light' | 'dark' | 'system'
    weekStartsOn: 'sunday' | 'monday'
    notifications: boolean
    timezone: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'demo@example.com': {
    password: 'password123',
    user: {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      avatar: '/placeholder.svg?height=40&width=40&text=DU',
      createdAt: new Date('2024-01-01'),
      preferences: {
        theme: 'light',
        weekStartsOn: 'monday',
        notifications: true,
        timezone: 'America/New_York'
      }
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('goalTracker_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('goalTracker_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    const userData = DEMO_USERS[email]
    if (userData && userData.password === password) {
      setUser(userData.user)
      localStorage.setItem('goalTracker_user', JSON.stringify(userData.user))
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (DEMO_USERS[email]) {
      setIsLoading(false)
      return false
    }
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date(),
      preferences: {
        theme: 'light',
        weekStartsOn: 'monday',
        notifications: true,
        timezone: 'America/New_York'
      }
    }
    DEMO_USERS[email] = { password, user: newUser }
    setUser(newUser)
    localStorage.setItem('goalTracker_user', JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('goalTracker_user')
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('goalTracker_user', JSON.stringify(updatedUser))
    if (DEMO_USERS[user.email]) {
      DEMO_USERS[user.email].user = updatedUser
    }
  }

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
  }

  return createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

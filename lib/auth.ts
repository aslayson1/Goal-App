export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}

// Mock authentication functions for development
export const mockUser: User = {
  id: "1",
  email: "user@example.com",
  name: "John Doe",
  avatar: "/placeholder-user.jpg",
}

export function getStoredAuth(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, loading: false }
  }

  const stored = localStorage.getItem("auth")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { user: null, loading: false }
    }
  }
  return { user: null, loading: false }
}

export function setStoredAuth(authState: AuthState) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth", JSON.stringify(authState))
  }
}

export function clearStoredAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth")
  }
}

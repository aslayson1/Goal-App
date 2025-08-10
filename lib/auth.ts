export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Mock authentication functions
export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "demo@example.com" && password === "password") {
    return {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      avatar: "/placeholder-user.jpg",
    }
  }

  throw new Error("Invalid credentials")
}

export const mockRegister = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    avatar: "/placeholder-user.jpg",
  }
}

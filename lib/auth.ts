export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: {
    theme: "light" | "dark" | "system"
    weekStartDay: "sunday" | "monday"
    timezone: string
    notifications: boolean
  }
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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "demo@example.com" && password === "password") {
    return {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      avatar: "/placeholder-user.jpg",
      preferences: {
        theme: "system",
        weekStartDay: "monday",
        timezone: "America/New_York",
        notifications: true,
      },
    }
  }

  throw new Error("Invalid credentials")
}

export const mockRegister = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: Date.now().toString(),
    name,
    email,
    preferences: {
      theme: "system",
      weekStartDay: "monday",
      timezone: "America/New_York",
      notifications: true,
    },
  }
}

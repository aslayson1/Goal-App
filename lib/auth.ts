export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: {
    theme?: string
    weekStartDay?: string
    timezone?: string
    notifications?: boolean
  }
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "demo@example.com" && password === "password") {
    return {
      id: "1",
      name: "John Doe",
      email: "demo@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
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

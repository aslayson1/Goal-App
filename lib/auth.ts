export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
}

// Mock authentication functions
export const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "demo@example.com" && password === "password") {
    return {
      id: "1",
      email,
      name: "Demo User",
      avatar: "/placeholder-user.jpg",
    }
  }

  throw new Error("Invalid credentials")
}

export const mockRegister = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: Date.now().toString(),
    email,
    name,
    avatar: "/placeholder-user.jpg",
  }
}

export const mockLogout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
}

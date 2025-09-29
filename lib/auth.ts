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

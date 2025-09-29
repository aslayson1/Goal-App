"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { AuthScreen } from "@/components/auth/auth-screen"
import { Dashboard } from "@/components/goal-tracker/dashboard"

export default function Page() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return <Dashboard />
}

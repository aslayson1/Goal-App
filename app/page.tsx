"use client"

import { AuthScreen } from "@/components/auth/auth-screen"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { SidebarInset } from "@/components/ui/sidebar"

export default function Page() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-screen">
            <h1 className="text-3xl font-bold">Welcome to Goal Tracker</h1>
            <p className="mt-2 text-muted-foreground">Start tracking your goals and achieving your dreams.</p>
          </div>
        </div>
      </SidebarInset>
    </>
  )
}

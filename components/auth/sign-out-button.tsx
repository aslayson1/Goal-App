"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export function SignOutButton({ className }: { className?: string }) {
  const { logout, isLoading } = useAuth()
  const router = useRouter()

  return (
    <button
      className={className}
      onClick={async () => {
        await logout()
        router.push("/login")
      }}
      disabled={isLoading}
    >
      Sign Out
    </button>
  )
}

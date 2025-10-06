"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import { mockLogin } from "@/lib/auth"
import Cookies from "js-cookie"

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email")?.toString()
      const password = formData.get("password")?.toString()

      if (!email || !password) {
        setError("Email and password are required")
        return
      }

      if (email === "demo@example.com" && password === "password") {
        try {
          const user = await mockLogin(email, password)
          Cookies.set("demo-user", JSON.stringify(user), {
            expires: 7,
            sameSite: "lax",
          })
          // Auth provider will detect the cookie and update state
          window.location.reload()
          return
        } catch (error: any) {
          setError(error.message)
          return
        }
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      // The onAuthStateChange listener will detect the login and update the UI
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue="demo@example.com" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" defaultValue="password" required />
      </div>

      <SubmitButton isLoading={isLoading} />

      <div className="text-sm text-gray-600 text-center">Demo credentials: demo@example.com / password</div>
    </form>
  )
}

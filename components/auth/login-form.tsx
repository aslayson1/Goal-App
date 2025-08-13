"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { signIn, resetPassword } from "@/lib/actions/auth"

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [state, setState] = useState<{ success?: boolean; error?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    if (state?.success) {
      router.push("/")
    }
  }, [state, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await signIn(null, formData)
      setState(result)
    } catch (error) {
      setState({ error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await resetPassword(null, formData)
      setState(result)
      if (result.success) {
        setShowReset(false)
      }
    } catch (error) {
      setState({ error: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {state.error}
            {state.error.includes("Invalid login credentials") && (
              <div className="mt-2">
                <button type="button" onClick={() => setShowReset(!showReset)} className="text-sm underline">
                  Forgot your password?
                </button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {state?.success && typeof state.success === "string" && (
        <Alert>
          <AlertDescription>{state.success}</AlertDescription>
        </Alert>
      )}

      {showReset && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">Enter your email to receive a password reset link:</p>
          <form onSubmit={handlePasswordReset} className="space-y-2">
            <Input name="email" type="email" placeholder="Enter your email" required />
            <Button type="submit" size="sm" disabled={isLoading}>
              Send Reset Link
            </Button>
          </form>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Enter your email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="Enter your password" required />
      </div>

      <SubmitButton isLoading={isLoading} />

      <div className="text-xs text-gray-500 text-center">
        Demo: demo@example.com / password | Need an account? Use the Register tab above.
      </div>
    </form>
  )
}

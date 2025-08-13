"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { signIn, resetPassword } from "@/lib/actions/auth"

import { useActionState } from "react"
import { useFormState } from "react-dom"

const useCompatibleFormState = typeof useActionState !== "undefined" ? useActionState : useFormState

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [state, formAction, pending] = useCompatibleFormState(signIn, null)
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    console.log("Login form state changed:", state, "pending:", pending)
    if (state?.success) {
      console.log("Login successful, redirecting...")
      router.push("/")
    }
  }, [state, router, pending])

  const handleFormSubmit = (formData: FormData) => {
    console.log("Form submitted with data:", Object.fromEntries(formData))
    formAction(formData)
  }

  return (
    <form action={handleFormSubmit} className="space-y-4">
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
          <form
            action={async (formData) => {
              const result = await resetPassword(null, formData)
              if (result.success) {
                setShowReset(false)
              }
            }}
            className="space-y-2"
          >
            <Input name="email" type="email" placeholder="Enter your email" required />
            <Button type="submit" size="sm">
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

      <SubmitButton pending={pending} />

      <div className="text-xs text-gray-500 text-center">
        Demo: demo@example.com / password | Need an account? Use the Register tab above.
      </div>
    </form>
  )
}

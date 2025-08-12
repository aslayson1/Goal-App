"use client"

import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/actions/auth"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [state, setState] = useState<{ success?: boolean; error?: string } | null>(null)

  useEffect(() => {
    if (state?.success) {
      router.push("/")
    }
  }, [state, router])

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await signIn(null, formData)
      setState(result)
    } catch (error) {
      setState({ error: "An unexpected error occurred" })
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
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

      <SubmitButton />

      <div className="text-sm text-gray-600 text-center">Demo credentials: demo@example.com / password</div>
    </form>
  )
}

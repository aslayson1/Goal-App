"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { User, Mail, Calendar } from "lucide-react"

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== "string") return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-[#05a7b0] text-white text-xl">
              {getInitials(user.user_metadata?.full_name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{user.user_metadata?.full_name || "User"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{user.email}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">User ID: {user.id.slice(0, 8)}...</span>
          </div>

          {user.created_at && (
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Member since {formatDate(user.created_at)}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <SignOutButton className="w-full" />
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

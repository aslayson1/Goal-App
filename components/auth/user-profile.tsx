"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Save, X } from "lucide-react"

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== "string") return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Manage your account information and preferences</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-4 border-gray-200">
            {user?.avatar && (
              <AvatarImage src={user.avatar || "/placeholder.svg?height=80&width=80&text=U"} alt={user?.name} />
            )}
            <AvatarFallback className="bg-gray-100 text-gray-600 text-xl font-semibold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>

          {/* Profile Form */}
          <div className="w-full space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              {isEditing ? (
                <Input
                  id="profile-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{user?.name || "No name set"}</div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profile-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">{user?.email || "No email set"}</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

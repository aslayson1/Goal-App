"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { Camera, LogOut, User, Settings, Bell, Loader2 } from "lucide-react"

interface UserProfileProps {
  onClose: () => void
}

const PREFERENCES_KEY = "user_preferences"

const loadPreferences = (userId: string) => {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem(`${PREFERENCES_KEY}_${userId}`)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const savePreferences = (userId: string, preferences: any) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`${PREFERENCES_KEY}_${userId}`, JSON.stringify(preferences))
  } catch (error) {
    console.error("[v0] Failed to save preferences to localStorage:", error)
  }
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const [formData, setFormData] = useState(() => {
    if (!user)
      return {
        name: "",
        email: "",
        theme: "system",
        weekStartDay: "monday",
        timezone: "America/New_York",
        notifications: true,
        dashboardMode: "12-week",
      }

    const savedPrefs = loadPreferences(user.id)
    return {
      name: savedPrefs?.name || user?.name || "",
      email: user?.email || "",
      theme: savedPrefs?.theme || user?.preferences?.theme || "system",
      weekStartDay: savedPrefs?.weekStartDay || user?.preferences?.weekStartDay || "monday",
      timezone: savedPrefs?.timezone || user?.preferences?.timezone || "America/New_York",
      notifications: savedPrefs?.notifications ?? user?.preferences?.notifications ?? true,
      dashboardMode: savedPrefs?.dashboardMode || user?.preferences?.dashboardMode || "12-week",
    }
  })

  if (!user) return null

  const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== "string") {
      return "U"
    }

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      console.log("[v0] Starting profile update with data:", formData)

      const preferences = {
        name: formData.name,
        theme: formData.theme,
        weekStartDay: formData.weekStartDay,
        timezone: formData.timezone,
        notifications: formData.notifications,
        dashboardMode: formData.dashboardMode,
      }

      savePreferences(user.id, preferences)
      console.log("[v0] Preferences saved to localStorage successfully")

      setMessage({ type: "success", text: "Profile updated successfully!" })

      // Trigger a page refresh to update the UI with new preferences
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("[v0] Unexpected error:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetCycle = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const today = new Date().toISOString()
      const startDateKey = `goalTracker_startDate_${user.id}`
      localStorage.setItem(startDateKey, today)
      console.log("[v0] Reset start date to:", today)

      // Reset goals progress to 0/initial state
      const goalsKey = `goals_data_${user.id}`
      const goalsData = localStorage.getItem(goalsKey)
      if (goalsData) {
        const parsed = JSON.parse(goalsData)
        // Reset all goals to 0 progress
        Object.keys(parsed).forEach((category) => {
          if (parsed[category].goals) {
            parsed[category].goals.forEach((goal: any) => {
              goal.completed = 0
            })
          }
        })
        localStorage.setItem(goalsKey, JSON.stringify(parsed))
        console.log("[v0] Goals progress reset")
      }

      setShowResetConfirm(false)
      setMessage({ type: "success", text: "Goal cycle has been reset successfully!" })

      // Reload after a short delay to let the dialog close
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error("[v0] Error resetting cycle:", error)
      setMessage({ type: "error", text: "Failed to reset goal cycle" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Manage your account settings and preferences</DialogDescription>
        </DialogHeader>

        {message && (
          <div
            className={`px-4 py-3 rounded border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/50 text-green-700"
                : "bg-red-500/10 border-red-500/50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        {user.avatar && <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />}
                        <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{formData.name}</h3>
                      <p className="text-sm text-gray-600">{formData.email}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Theme</Label>
                        <p className="text-sm text-gray-600">Choose your preferred theme</p>
                      </div>
                      <Select
                        name="theme"
                        value={formData.theme}
                        onValueChange={(value) => handleInputChange("theme", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dashboard View</Label>
                        <p className="text-sm text-gray-600">Choose your dashboard layout</p>
                      </div>
                      <Select
                        name="dashboardMode"
                        value={formData.dashboardMode}
                        onValueChange={(value) => handleInputChange("dashboardMode", value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12-week">12-Week Year</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Week Start Day</Label>
                        <p className="text-sm text-gray-600">First day of the week</p>
                      </div>
                      <Select
                        name="week_start_day"
                        value={formData.weekStartDay}
                        onValueChange={(value) => handleInputChange("weekStartDay", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Timezone</Label>
                        <p className="text-sm text-gray-600">Your local timezone</p>
                      </div>
                      <Select
                        name="timezone"
                        value={formData.timezone}
                        onValueChange={(value) => handleInputChange("timezone", value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications about your goals</p>
                    </div>
                    <div>
                      <Switch
                        checked={formData.notifications}
                        onCheckedChange={(checked) => handleInputChange("notifications", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account settings and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    Reset Goal Cycle
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => {
                      logout()
                      onClose()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Goal Cycle?</DialogTitle>
            <DialogDescription>
              This will reset your goal cycle start date to today and clear all progress. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetCycle} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Cycle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

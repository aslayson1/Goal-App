"use client"

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
import { Camera, LogOut, User, Settings, Bell } from "lucide-react"

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Manage your account settings and preferences</DialogDescription>
        </DialogHeader>

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
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
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
                    <Select defaultValue={user.preferences?.theme || "system"}>
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
                      <Label>Week Start Day</Label>
                      <p className="text-sm text-gray-600">First day of the week</p>
                    </div>
                    <Select defaultValue={user.preferences?.weekStartDay || "monday"}>
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
                    <Select defaultValue={user.preferences?.timezone || "America/New_York"}>
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
                  <Switch defaultChecked={user.preferences?.notifications} />
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
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

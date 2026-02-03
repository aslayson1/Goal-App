"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { UserProfile } from "@/components/profile/user-profile"
import { useAuth } from "@/components/auth/auth-provider"
import { useState } from "react"

function getInitials(name?: string | null): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AppHeader() {
  const { user } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white px-6">
      <div className="flex items-center gap-3">
        <Image
          src="/layson-group-logo.png"
          alt="Layson Group"
          width={150}
          height={36}
          className="h-9 w-auto object-contain"
          priority
        />
      </div>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 border-2 border-black">
              {user?.avatar && (
                <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40&text=U"} alt={user?.name} />
              )}
              <AvatarFallback className="bg-white text-black text-xs font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Dialog open={showProfile} onOpenChange={setShowProfile}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Profile Settings</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Profile Settings</DialogTitle>
                <DialogDescription>Manage your user profile information.</DialogDescription>
              </DialogHeader>
              <UserProfile userId={user?.id} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProfile(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem asChild>
            <SignOutButton className="w-full text-left" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

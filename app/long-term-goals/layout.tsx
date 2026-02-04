'use client'

import React, { useState } from "react"
import Image from "next/image"

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { useAuth } from "@/components/auth/auth-provider"
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

function getInitials(name?: string | null): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function LongTermGoalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {/* Full-width Top Header Bar */}
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white px-6 w-full">
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

        {/* Sidebar and Content Area */}
        <div className="flex flex-1 overflow-hidden w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 min-w-0 w-full">
            <main className="h-full overflow-auto p-6 bg-slate-50">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}

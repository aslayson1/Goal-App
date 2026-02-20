'use client'

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, LayoutDashboard, Target, Users, Activity } from "lucide-react"

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Full-width Top Header Bar */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white px-6 w-full">
        <button
          onClick={() => router.push('/')}
          className="hover:opacity-75 transition-opacity"
          aria-label="Go to dashboard"
        >
          {user?.companyLogo ? (
            <img
              src={user.companyLogo}
              alt="Company Logo"
              className="h-9 w-auto object-contain max-w-[150px]"
            />
          ) : (
            <Image
              src="/layson-group-logo.png"
              alt="Layson Group"
              width={150}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
          )}
        </button>

        {/* Right side: Avatar dropdown and Mobile hamburger menu */}
        <div className="flex items-center gap-2">
          {/* Desktop Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden lg:flex items-center space-x-2">
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
                  <UserProfile onClose={() => setShowProfile(false)} />
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

          {/* Mobile Menu - Sheet with Navigation + Settings */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <nav className="flex flex-col h-full">
                {/* Navigation Items */}
                <div className="flex-1 overflow-auto py-4">
                  <div className="space-y-2 px-4">
                    <Link href="/" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/long-term-goals" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <Target className="mr-3 h-4 w-4" />
                        Long-term Goals
                      </Button>
                    </Link>
                    <Link href="/agents" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <Users className="mr-3 h-4 w-4" />
                        Agents
                      </Button>
                    </Link>
                    <Link href="/fitness" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <Activity className="mr-3 h-4 w-4" />
                        Fitness
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Settings and Sign Out at Bottom */}
                <div className="border-t space-y-2 p-4">
                  <Dialog open={showProfile} onOpenChange={(open) => {
                    setShowProfile(open)
                    if (!open) setMenuOpen(false)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start text-base">
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle>Profile Settings</DialogTitle>
                        <DialogDescription>Manage your user profile information.</DialogDescription>
                      </DialogHeader>
                      <UserProfile onClose={() => setShowProfile(false)} />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowProfile(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <SignOutButton className="w-full justify-start text-base px-4 py-2 h-10 inline-flex items-center rounded-md hover:bg-accent hover:text-accent-foreground" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Sidebar and Content Area */}
      <div className="flex flex-1 overflow-hidden w-full">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <SidebarInset className="flex-1 min-w-0 w-full">
          <main className="h-full overflow-auto p-3 md:p-6 bg-slate-50">
            {children}
          </main>
        </SidebarInset>
      </div>
      </div>
    </SidebarProvider>
  )
}

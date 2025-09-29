"use client"

import { useState } from "react"
import { Plus, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"

interface HeaderProps {
  onCreateGoal: () => void
  onCreateCategory: () => void
}

export function Header({ onCreateGoal, onCreateCategory }: HeaderProps) {
  const { user } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== "string") return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">
          Hi {user?.name?.split(" ")[0] || "there"},
        </h1>
        <p className="text-muted-foreground text-pretty">Track your goals and make progress every day.</p>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          onClick={onCreateGoal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
        <Button
          variant="outline"
          onClick={onCreateCategory}
          className="border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-accent">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                {user?.avatar && <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user?.name || "User"} />}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={() => setShowProfile(true)} className="hover:bg-accent">
              <User className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild>
              <SignOutButton className="w-full text-left hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

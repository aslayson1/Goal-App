"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Target,
  Flame,
  PlusCircle,
  CheckCircle,
  Trophy,
  Crown,
  Check,
  ListChecks,
  ClipboardCheck,
  Award,
  FolderPlus,
  Folders,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react"
import type { UserAchievement } from "@/lib/database/achievements"

interface AchievementBadgeProps {
  userAchievement: UserAchievement
  size?: "sm" | "md" | "lg"
  showProgress?: boolean
}

const iconMap = {
  target: Target,
  flame: Flame,
  "plus-circle": PlusCircle,
  "check-circle": CheckCircle,
  trophy: Trophy,
  crown: Crown,
  check: Check,
  "list-checks": ListChecks,
  "clipboard-check": ClipboardCheck,
  award: Award,
  "folder-plus": FolderPlus,
  folders: Folders,
  star: Star,
  zap: Zap,
  "trending-up": TrendingUp,
}

export function AchievementBadge({ userAchievement, size = "md", showProgress = false }: AchievementBadgeProps) {
  const { achievement } = userAchievement
  if (!achievement) return null

  const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Target

  const sizeClasses = {
    sm: "h-12 w-12 p-2",
    md: "h-16 w-16 p-3",
    lg: "h-20 w-20 p-4",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={`${sizeClasses[size]} border-2 ${achievement.color} bg-card/50 backdrop-blur-sm cursor-pointer hover:scale-105 transition-all duration-200`}
          >
            <CardContent className="p-0 flex items-center justify-center h-full">
              <IconComponent className={`${iconSizes[size]} text-current`} />
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs bg-card border-border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={achievement.color}>
                {achievement.badge_level}
              </Badge>
              <span className="font-semibold text-foreground">{achievement.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            <div className="text-xs text-muted-foreground">Earned on {formatDate(userAchievement.earned_at)}</div>
            {showProgress && (
              <div className="text-xs text-muted-foreground">
                Progress: {userAchievement.progress_value}/{achievement.requirement_value}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

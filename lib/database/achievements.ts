import { createClient } from "@/lib/supabase/server"

export interface Achievement {
  id: string
  title: string
  description: string
  badge_type: string
  badge_level: string
  requirement_value: number
  icon: string
  color: string
  created_at: string
  updated_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  progress_value: number
  achievement?: Achievement
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("requirement_value", { ascending: true })

  if (error) {
    console.error("Error fetching achievements:", error)
    return []
  }

  return data || []
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("user_achievements")
    .select(
      `
      *,
      achievement:achievements(*)
    `,
    )
    .eq("user_id", userId)
    .order("earned_at", { ascending: false })

  if (error) {
    console.error("Error fetching user achievements:", error)
    return []
  }

  return data || []
}

export async function checkAndAwardAchievements(
  userId: string,
  stats: {
    currentStreak: number
    totalGoals: number
    completedGoals: number
    totalTasks: number
    completedTasks: number
    totalCategories: number
  },
): Promise<UserAchievement[]> {
  const supabase = await createClient()
  const newAchievements: UserAchievement[] = []

  // Get all achievements and user's current achievements
  const [achievements, userAchievements] = await Promise.all([getAchievements(), getUserAchievements(userId)])

  const earnedAchievementIds = new Set(userAchievements.map((ua) => ua.achievement_id))

  // Check each achievement
  for (const achievement of achievements) {
    if (earnedAchievementIds.has(achievement.id)) continue

    let shouldAward = false
    let progressValue = 0

    switch (achievement.badge_type) {
      case "streak":
        progressValue = stats.currentStreak
        shouldAward = stats.currentStreak >= achievement.requirement_value
        break

      case "goals":
        if (achievement.title === "Goal Setter") {
          progressValue = stats.totalGoals
          shouldAward = stats.totalGoals >= achievement.requirement_value
        } else {
          progressValue = stats.completedGoals
          shouldAward = stats.completedGoals >= achievement.requirement_value
        }
        break

      case "tasks":
        progressValue = stats.completedTasks
        shouldAward = stats.completedTasks >= achievement.requirement_value
        break

      case "categories":
        progressValue = stats.totalCategories
        shouldAward = stats.totalCategories >= achievement.requirement_value
        break

      case "special":
        // Special achievements are handled separately
        break
    }

    if (shouldAward) {
      const { data, error } = await supabase
        .from("user_achievements")
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
          progress_value: progressValue,
        })
        .select(
          `
          *,
          achievement:achievements(*)
        `,
        )
        .single()

      if (!error && data) {
        newAchievements.push(data)
      }
    }
  }

  return newAchievements
}

export async function awardSpecialAchievement(
  userId: string,
  achievementTitle: string,
  progressValue = 1,
): Promise<UserAchievement | null> {
  const supabase = await createClient()

  // Find the achievement by title
  const { data: achievement } = await supabase.from("achievements").select("*").eq("title", achievementTitle).single()

  if (!achievement) return null

  // Check if user already has this achievement
  const { data: existing } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievement.id)
    .single()

  if (existing) return null

  // Award the achievement
  const { data, error } = await supabase
    .from("user_achievements")
    .insert({
      user_id: userId,
      achievement_id: achievement.id,
      progress_value: progressValue,
    })
    .select(
      `
      *,
      achievement:achievements(*)
    `,
    )
    .single()

  if (error) {
    console.error("Error awarding special achievement:", error)
    return null
  }

  return data
}

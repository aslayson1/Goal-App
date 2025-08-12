"use client"

// Adding Supabase imports for task persistence
import { setTaskCompleted, createTask } from "@/lib/data/tasks"
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Target,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfile } from "@/components/profile/user-profile"
import { AuthScreen } from "@/components/auth/auth-screen"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"

// Drag and Drop imports
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { arrayMove } from "@dnd-kit/sortable"
import type { DragEndEvent } from "@dnd-kit/core"
import { useSensors } from "@dnd-kit/core"
import { useSensor } from "@dnd-kit/core"
import { PointerSensor } from "@dnd-kit/core"
import { KeyboardSensor } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useState, useEffect } from "react"

// Custom CSS class for white checkbox background with thinner border
const checkboxStyles =
  "bg-white border border-gray-400 data-[state=checked]:border-[#05a7b0] data-[state=checked]:bg-[#05a7b0]"

// Your actual goals data from the SQL file
const initialGoalsData = {
  "Layson Group": [
    {
      id: "lg1",
      title: "Add 3 agents to Memphis & Nashville and 2 to Knoxville",
      description: "Expand team across key Tennessee markets",
      targetCount: 7,
      currentCount: 2,
      notes: "Focus on experienced agents with local market knowledge",
      weeklyTarget: 0.6,
      category: "Business",
    },
    {
      id: "lg2",
      title: "Create automated newsletter",
      description: "Build automated email marketing system",
      targetCount: 1,
      currentCount: 0,
      notes: "Need to set up email templates and automation workflows",
      weeklyTarget: 0.08,
      category: "Business",
    },
    {
      id: "lg3",
      title: "Create better tracking system for leads generated & ROI",
      description: "Implement comprehensive lead tracking and ROI analysis",
      targetCount: 1,
      currentCount: 0,
      notes: "Research CRM integrations and analytics tools",
      weeklyTarget: 0.08,
      category: "Business",
    },
    {
      id: "lg4",
      title: "Build out SISU/CTE version for Layson Group",
      description: "Develop custom SISU/CTE implementation",
      targetCount: 1,
      currentCount: 0,
      notes: "Coordinate with development team on requirements",
      weeklyTarget: 0.08,
      category: "Business",
    },
  ],
  Upside: [
    {
      id: "up1",
      title: "Get 100 paid users for Upside",
      description: "Reach 100 paying customers milestone",
      targetCount: 100,
      currentCount: 15,
      notes: "Current conversion rate is 8%, need to improve onboarding",
      weeklyTarget: 8.3,
      category: "Business",
    },
    {
      id: "up2",
      title: "Secure $750,000 in Funding for Upside",
      description: "Complete Series A funding round",
      targetCount: 750000,
      currentCount: 0,
      notes: "Preparing pitch deck and financial projections",
      weeklyTarget: 62500,
      category: "Business",
    },
    {
      id: "up3",
      title: "Onboard all major Hedgefunds to Upside",
      description: "Get major hedge funds using the platform",
      targetCount: 5,
      currentCount: 1,
      notes: "Initial conversations with 3 funds, 1 signed LOI",
      weeklyTarget: 0.4,
      category: "Business",
    },
    {
      id: "up4",
      title: "Convert 10% of Free Trials to Paid",
      description: "Improve conversion rate from free to paid users",
      targetCount: 10,
      currentCount: 8,
      notes: "Current rate is 8%, need better onboarding flow",
      weeklyTarget: 0.8,
      category: "Business",
    },
    {
      id: "up5",
      title: "Identify and reach out to 1 Strategic Partner",
      description: "Find and engage key strategic partnership",
      targetCount: 1,
      currentCount: 0,
      notes: "Evaluating potential partners in real estate tech space",
      weeklyTarget: 0.08,
      category: "Business",
    },
  ],
  "Poplar Title": [
    {
      id: "pt1",
      title: "Get to #3 on Google Maps & Search Results",
      description: "Improve local SEO ranking for title services",
      targetCount: 3,
      currentCount: 7,
      notes: "Currently ranking #7, need more local reviews and citations",
      weeklyTarget: 0.25,
      category: "Business",
    },
    {
      id: "pt2",
      title: "Get 5 deals from Upside",
      description: "Generate title business through Upside platform",
      targetCount: 5,
      currentCount: 1,
      notes: "First deal closed last month, pipeline building",
      weeklyTarget: 0.4,
      category: "Business",
    },
  ],
  "Relationships/Family": [
    {
      id: "rf1",
      title: "Take Sarah out on 6 dates",
      description: "Quality time with spouse - planned date nights",
      targetCount: 6,
      currentCount: 2,
      notes: "Planned dinner and movie night, need to schedule more",
      weeklyTarget: 0.5,
      category: "Relationships",
    },
    {
      id: "rf2",
      title: "Meet with Sarah 3 times to go over goals",
      description: "Regular goal alignment sessions with spouse",
      targetCount: 3,
      currentCount: 1,
      notes: "First session went well, scheduled monthly check-ins",
      weeklyTarget: 0.25,
      category: "Relationships",
    },
    {
      id: "rf3",
      title: "6 Family Nights (3 Pickleball)",
      description: "Regular family activities including pickleball",
      targetCount: 6,
      currentCount: 2,
      notes: "Kids love pickleball nights, great family bonding",
      weeklyTarget: 0.5,
      category: "Relationships",
    },
    {
      id: "rf4",
      title: "Meet with kids 3 times to go over their goals",
      description: "Goal-setting sessions with children",
      targetCount: 3,
      currentCount: 1,
      notes: "First session was productive, kids are engaged",
      weeklyTarget: 0.25,
      category: "Relationships",
    },
    {
      id: "rf5",
      title: "3 Daddy Daughter Days",
      description: "Special one-on-one time with daughter",
      targetCount: 3,
      currentCount: 1,
      notes: "Zoo trip was amazing, planning museum visit next",
      weeklyTarget: 0.25,
      category: "Relationships",
    },
    {
      id: "rf6",
      title: "3 Bro Days",
      description: "Special one-on-one time with son",
      targetCount: 3,
      currentCount: 1,
      notes: "Basketball game was great, planning fishing trip",
      weeklyTarget: 0.25,
      category: "Relationships",
    },
    {
      id: "rf7",
      title: "Call parents 12 times",
      description: "Regular check-ins with parents",
      targetCount: 12,
      currentCount: 4,
      notes: "Weekly Sunday calls established as routine",
      weeklyTarget: 1,
      category: "Relationships",
    },
    {
      id: "rf8",
      title: "Call brothers 12 times",
      description: "Stay connected with siblings",
      targetCount: 12,
      currentCount: 3,
      notes: "Group chat helps, but need more voice calls",
      weeklyTarget: 1,
      category: "Relationships",
    },
  ],
  "Physical/Nutrition/Health": [
    {
      id: "pnh1",
      title: "Run/Walk/Ruck 120 Miles",
      description: "Complete 120 miles of cardio exercise",
      targetCount: 120,
      currentCount: 32,
      notes: "Averaging 8 miles per week, on track",
      weeklyTarget: 10,
      category: "Health",
    },
    {
      id: "pnh2",
      title: "Workout 60 times",
      description: "Complete 60 workout sessions",
      targetCount: 60,
      currentCount: 18,
      notes: "5 workouts per week schedule working well",
      weeklyTarget: 5,
      category: "Health",
    },
    {
      id: "pnh3",
      title: "Stretch 60 times",
      description: "Daily stretching routine",
      targetCount: 60,
      currentCount: 16,
      notes: "Morning stretches becoming habit",
      weeklyTarget: 5,
      category: "Health",
    },
    {
      id: "pnh4",
      title: "No alcohol 48 days",
      description: "Alcohol-free days for health",
      targetCount: 48,
      currentCount: 14,
      notes: "Weekdays are easier, weekends more challenging",
      weeklyTarget: 4,
      category: "Health",
    },
    {
      id: "pnh5",
      title: "Take vitamins 60 times",
      description: "Daily vitamin supplementation",
      targetCount: 60,
      currentCount: 20,
      notes: "Set phone reminders, consistency improving",
      weeklyTarget: 5,
      category: "Health",
    },
  ],
  "Spiritual/Contribution": [
    {
      id: "sc1",
      title: "Go to Church 10 Times",
      description: "Regular church attendance",
      targetCount: 10,
      currentCount: 3,
      notes: "Sunday services, family enjoys the community",
      weeklyTarget: 0.8,
      category: "Spiritual",
    },
    {
      id: "sc2",
      title: "Meditate/Affirmations 60 Times",
      description: "Daily meditation and positive affirmations",
      targetCount: 60,
      currentCount: 18,
      notes: "10-minute morning sessions, very centering",
      weeklyTarget: 5,
      category: "Spiritual",
    },
    {
      id: "sc3",
      title: "Read/listen to bible 60 times",
      description: "Daily bible reading or listening",
      targetCount: 60,
      currentCount: 15,
      notes: "Using audio bible during commute",
      weeklyTarget: 5,
      category: "Spiritual",
    },
  ],
  "Intellect/Education": [
    {
      id: "ie1",
      title: "Review Goals 60 Times",
      description: "Daily goal review and reflection",
      targetCount: 60,
      currentCount: 22,
      notes: "Morning review routine established",
      weeklyTarget: 5,
      category: "Education",
    },
    {
      id: "ie2",
      title: "Read 2 Books",
      description: "Complete 2 books during 12-week period",
      targetCount: 2,
      currentCount: 1,
      notes: "Finished 'Atomic Habits', starting 'Deep Work'",
      weeklyTarget: 0.17,
      category: "Education",
    },
    {
      id: "ie3",
      title: "Listen to 15 Podcasts",
      description: "Educational podcast listening",
      targetCount: 15,
      currentCount: 6,
      notes: "Business and personal development focused",
      weeklyTarget: 1.25,
      category: "Education",
    },
  ],
  "Lifestyle/Adventure": [
    {
      id: "la1",
      title: "Schedule 1 short weekend Trip",
      description: "Plan and execute weekend getaway",
      targetCount: 1,
      currentCount: 0,
      notes: "Looking at Nashville or Gatlinburg options",
      weeklyTarget: 0.08,
      category: "Lifestyle",
    },
    {
      id: "la2",
      title: "Golf 3 Times",
      description: "Play golf for recreation and networking",
      targetCount: 3,
      currentCount: 1,
      notes: "Played with clients, great for relationship building",
      weeklyTarget: 0.25,
      category: "Lifestyle",
    },
    {
      id: "la3",
      title: "Do 3 New activities",
      description: "Try 3 new experiences or activities",
      targetCount: 3,
      currentCount: 1,
      notes: "Tried rock climbing, was challenging but fun",
      weeklyTarget: 0.25,
      category: "Lifestyle",
    },
  ],
  "Personal Finance/Material": [
    {
      id: "pfm1",
      title: "Buy 1st Tax Sale Property",
      description: "Purchase first property at tax sale",
      targetCount: 1,
      currentCount: 0,
      notes: "Researching properties and auction process",
      weeklyTarget: 0.08,
      category: "Financial",
    },
    {
      id: "pfm2",
      title: "Move Business Reserves to High Yield Account",
      description: "Optimize business cash management",
      targetCount: 1,
      currentCount: 0,
      notes: "Comparing high-yield business account options",
      weeklyTarget: 0.08,
      category: "Financial",
    },
  ],
}

// Add after the existing initialGoalsData
const initialLongTermGoals = {
  "1-year": {
    Business: [
      {
        id: "1y_b1",
        title: "Scale Upside to 1,000 paid users",
        description: "Grow the platform to 1,000 paying customers with strong retention",
        targetDate: "2025-12-31",
        category: "Business",
        status: "in-progress", // in-progress, completed, on-hold
        notes: "Focus on product-market fit and customer success",
        milestones: [
          { id: "m1", title: "Reach 250 users", completed: false, targetDate: "2025-03-31" },
          { id: "m2", title: "Reach 500 users", completed: false, targetDate: "2025-06-30" },
          { id: "m3", title: "Reach 750 users", completed: false, targetDate: "2025-09-30" },
          { id: "m4", title: "Reach 1,000 users", completed: false, targetDate: "2025-12-31" },
        ],
      },
      {
        id: "1y_b2",
        title: "Expand Layson Group to 3 new markets",
        description: "Open offices in Atlanta, Birmingham, and Louisville",
        targetDate: "2025-10-31",
        category: "Business",
        status: "in-progress",
        notes: "Research market conditions and local partnerships",
        milestones: [
          { id: "m1", title: "Market research complete", completed: true, targetDate: "2025-01-31" },
          { id: "m2", title: "Atlanta office opened", completed: false, targetDate: "2025-05-31" },
          { id: "m3", title: "Birmingham office opened", completed: false, targetDate: "2025-08-31" },
          { id: "m4", title: "Louisville office opened", completed: false, targetDate: "2025-10-31" },
        ],
      },
    ],
    Personal: [
      {
        id: "1y_p1",
        title: "Complete a marathon",
        description: "Train for and complete a full 26.2 mile marathon",
        targetDate: "2025-11-15",
        category: "Personal",
        status: "in-progress",
        notes: "Following a 20-week training program",
        milestones: [
          { id: "m1", title: "Complete 10K race", completed: false, targetDate: "2025-04-15" },
          { id: "m2", title: "Complete half marathon", completed: false, targetDate: "2025-07-15" },
          { id: "m3", title: "Complete 20-mile training run", completed: false, targetDate: "2025-10-01" },
          { id: "m4", title: "Complete full marathon", completed: false, targetDate: "2025-11-15" },
        ],
      },
    ],
    Financial: [
      {
        id: "1y_f1",
        title: "Build 6-month emergency fund",
        description: "Save $50,000 for emergency expenses",
        targetDate: "2025-12-31",
        category: "Financial",
        status: "in-progress",
        notes: "Currently at $15,000, need $35,000 more",
        milestones: [
          { id: "m1", title: "Save $20,000", completed: false, targetDate: "2025-03-31" },
          { id: "m2", title: "Save $30,000", completed: false, targetDate: "2025-06-30" },
          { id: "m3", title: "Save $40,000", completed: false, targetDate: "2025-09-30" },
          { id: "m4", title: "Save $50,000", completed: false, targetDate: "2025-12-31" },
        ],
      },
    ],
  },
  "5-year": {
    Business: [
      {
        id: "5y_b1",
        title: "Exit Upside for $50M+",
        description: "Build Upside to a market-leading position and achieve successful exit",
        targetDate: "2029-12-31",
        category: "Business",
        status: "in-progress",
        notes: "Focus on building defensible moats and strong unit economics",
        milestones: [
          { id: "m1", title: "Reach $5M ARR", completed: false, targetDate: "2026-12-31" },
          { id: "m2", title: "Raise Series B", completed: false, targetDate: "2027-06-30" },
          { id: "m3", title: "Reach $20M ARR", completed: false, targetDate: "2028-12-31" },
          { id: "m4", title: "Complete exit", completed: false, targetDate: "2029-12-31" },
        ],
      },
      {
        id: "5y_b2",
        title: "Build Layson Group into regional powerhouse",
        description: "Expand to 15+ markets across the Southeast",
        targetDate: "2029-12-31",
        category: "Business",
        status: "in-progress",
        notes: "Focus on sustainable growth and strong local partnerships",
        milestones: [
          { id: "m1", title: "Reach 10 markets", completed: false, targetDate: "2026-12-31" },
          { id: "m2", title: "Reach $100M in transactions", completed: false, targetDate: "2027-12-31" },
          { id: "m3", title: "Reach 15 markets", completed: false, targetDate: "2028-12-31" },
          { id: "m4", title: "Establish market leadership", completed: false, targetDate: "2029-12-31" },
        ],
      },
    ],
    Personal: [
      {
        id: "5y_p1",
        title: "Complete an Ironman triathlon",
        description: "Train for and complete a full Ironman (2.4mi swim, 112mi bike, 26.2mi run)",
        targetDate: "2028-10-15",
        category: "Personal",
        status: "in-progress",
        notes: "Ultimate endurance challenge - will require 2+ years of dedicated training",
        milestones: [
          { id: "m1", title: "Complete Olympic triathlon", completed: false, targetDate: "2026-08-15" },
          { id: "m2", title: "Complete Half Ironman", completed: false, targetDate: "2027-06-15" },
          { id: "m3", title: "Complete second Half Ironman", completed: false, targetDate: "2028-04-15" },
          { id: "m4", title: "Complete full Ironman", completed: false, targetDate: "2028-10-15" },
        ],
      },
      {
        id: "5y_p2",
        title: "Take family on month-long European adventure",
        description: "Plan and execute a month-long family trip through Europe",
        targetDate: "2027-07-31",
        category: "Personal",
        status: "in-progress",
        notes: "Want kids to experience different cultures and create lasting memories",
        milestones: [
          { id: "m1", title: "Research and plan itinerary", completed: false, targetDate: "2026-12-31" },
          { id: "m2", title: "Save for trip expenses", completed: false, targetDate: "2027-03-31" },
          { id: "m3", title: "Book flights and accommodations", completed: false, targetDate: "2027-04-30" },
          { id: "m4", title: "Complete the trip", completed: false, targetDate: "2027-07-31" },
        ],
      },
    ],
    Financial: [
      {
        id: "5y_f1",
        title: "Achieve $5M net worth",
        description: "Build wealth through business success and smart investments",
        targetDate: "2029-12-31",
        category: "Financial",
        status: "in-progress",
        notes: "Combination of business equity, real estate, and investment portfolio",
        milestones: [
          { id: "m1", title: "Reach $1M net worth", completed: false, targetDate: "2026-12-31" },
          { id: "m2", title: "Reach $2M net worth", completed: false, targetDate: "2027-12-31" },
          { id: "m3", title: "Reach $3.5M net worth", completed: false, targetDate: "2028-12-31" },
          { id: "m4", title: "Reach $5M net worth", completed: false, targetDate: "2029-12-31" },
        ],
      },
    ],
  },
}

// Weekly and Daily Tasks Data Structure
const initialWeeklyTasks = {
  "Week 4": [
    {
      id: "w4_1",
      title: "Complete Upside pitch deck",
      description: "Finalize slides for investor meetings",
      category: "Upside",
      goalId: "up2",
      completed: false,
      priority: "high",
      estimatedHours: 8,
    },
    {
      id: "w4_2",
      title: "Interview 2 potential agents in Memphis",
      description: "Screen candidates for Memphis expansion",
      category: "Layson Group",
      goalId: "lg1",
      completed: true,
      priority: "high",
      estimatedHours: 4,
    },
    {
      id: "w4_3",
      title: "Plan date night with Sarah",
      description: "Book restaurant and activity for weekend",
      category: "Relationships/Family",
      goalId: "rf1",
      completed: false,
      priority: "medium",
      estimatedHours: 1,
    },
  ],
}

const initialDailyTasks = {
  Monday: [
    {
      id: "mon_1",
      title: "Review 12-week goals",
      description: "Morning goal review and planning",
      category: "Intellect/Education",
      goalId: "ie1",
      completed: true,
      timeBlock: "6:00 AM",
      estimatedMinutes: 15,
    },
    {
      id: "mon_2",
      title: "Workout - Upper body",
      description: "Chest, shoulders, triceps routine",
      category: "Physical/Nutrition/Health",
      goalId: "pnh2",
      completed: true,
      timeBlock: "6:30 AM",
      estimatedMinutes: 45,
    },
    {
      id: "mon_3",
      title: "Work on Upside frontend",
      description: "Review frontend and make completion notes",
      category: "Upside",
      goalId: "up1",
      completed: false,
      timeBlock: "9:00 AM",
      estimatedMinutes: 120,
    },
  ],
  Tuesday: [
    {
      id: "tue_1",
      title: "Meditation and affirmations",
      description: "10-minute morning meditation",
      category: "Spiritual/Contribution",
      goalId: "sc2",
      completed: false,
      timeBlock: "6:00 AM",
      estimatedMinutes: 10,
    },
    {
      id: "tue_2",
      title: "Run 3 miles",
      description: "Cardio session - neighborhood route",
      category: "Physical/Nutrition/Health",
      goalId: "pnh1",
      completed: false,
      timeBlock: "6:15 AM",
      estimatedMinutes: 30,
    },
  ],
  Wednesday: [
    {
      id: "wed_1",
      title: "Bible reading",
      description: "10 minutes of scripture study",
      category: "Spiritual/Contribution",
      goalId: "sc3",
      completed: false,
      timeBlock: "6:00 AM",
      estimatedMinutes: 10,
    },
  ],
  Thursday: [
    {
      id: "thu_1",
      title: "Meet with Nate from Epicenter",
      description: "Strategic partnership discussion",
      category: "Upside",
      goalId: "up5",
      completed: false,
      timeBlock: "2:00 PM",
      estimatedMinutes: 60,
    },
  ],
  Friday: [
    {
      id: "fri_1",
      title: "Family pickleball night",
      description: "Play pickleball with family",
      category: "Relationships/Family",
      goalId: "rf3",
      completed: false,
      timeBlock: "7:00 PM",
      estimatedMinutes: 90,
    },
  ],
}

interface WeeklyTask {
  id: string
  title: string
  description: string
  category: string
  goalId: string
  completed: boolean
  priority: "low" | "medium" | "high"
  estimatedHours: number
  dbId?: string
}

interface DailyTask {
  id: string
  title: string
  description: string
  category: string
  goalId: string
  completed: boolean
  timeBlock: string
  estimatedMinutes: number
  dbId?: string
}

interface GoalsData {
  [category: string]: Goal[]
}

interface Goal {
  id: string
  title: string
  description: string
  targetCount: number
  currentCount: number
  notes: string
  weeklyTarget: number
  category: string
}

interface LongTermGoal {
  id: string
  title: string
  description: string
  targetDate: string
  category: string
  status: "in-progress" | "completed" | "on-hold"
  notes: string
  milestones: {
    id: string
    title: string
    completed: boolean
    targetDate: string
  }[]
}

interface LongTermGoalsData {
  "1-year": {
    [category: string]: LongTermGoal[]
  }
  "5-year": {
    [category: string]: LongTermGoal[]
  }
}

// Add this helper function after the interfaces and before the main component
const extractNumberFromTitle = (title: string): number => {
  if (!title.trim()) return 0

  // Remove common words that might contain numbers but aren't targets
  const cleanTitle = title.toLowerCase().replace(/\b(1st|2nd|3rd|first|second|third)\b/g, "") // Remove ordinals

  // Find all numbers in the title, including those with commas or dollar signs
  const numberMatches = cleanTitle.match(/\$?[\d,]+/g)

  if (!numberMatches) return 0

  // Convert matches to actual numbers and filter out very small numbers (likely not targets)
  const numbers = numberMatches
    .map((match) => {
      // Remove $ and commas, then convert to number
      const cleanNumber = match.replace(/[$,]/g, "")
      return Number.parseInt(cleanNumber, 10)
    })
    .filter((num) => !isNaN(num) && num > 0)

  if (numbers.length === 0) return 0

  // Return the largest number found (most likely to be the target)
  return Math.max(...numbers)
}

// Sortable Task Item Components
function SortableWeeklyTaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  getPriorityColor,
}: {
  task: WeeklyTask
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  getPriorityColor: (priority: string) => string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg bg-gray-50 border border-border ${isDragging ? "shadow-lg" : ""}`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <Checkbox checked={task.completed} onCheckedChange={onToggle} className={`${checkboxStyles}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {task.estimatedHours}h estimated
        </span>
        {task.completed && (
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        )}
      </div>
    </div>
  )
}

function SortableDailyTaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: DailyTask
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg bg-gray-50 border border-border ${isDragging ? "shadow-lg" : ""}`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <Checkbox checked={task.completed} onCheckedChange={onToggle} className={`${checkboxStyles}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              {task.timeBlock && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 font-mono">{task.timeBlock}</span>
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      {task.completed && (
        <div className="flex justify-end text-xs">
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        </div>
      )}
    </div>
  )
}

function GoalTrackerApp() {
  const { user } = useAuth()
  const [goalsData, setGoalsData] = useState<GoalsData>(initialGoalsData)
  const [weeklyTasks, setWeeklyTasks] = useState(initialWeeklyTasks)
  const [dailyTasks, setDailyTasks] = useState(initialDailyTasks)
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [activeView, setActiveView] = useState("daily")
  const [currentWeek, setCurrentWeek] = useState(4)
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = new Date().getDay()
    return days[today]
  })

  // Add state for long-term goals:
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoalsData>(initialLongTermGoals)
  const [showAddLongTermGoal, setShowAddLongTermGoal] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1-year" | "5-year">("1-year")
  const [newLongTermGoal, setNewLongTermGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "",
    notes: "",
    milestones: [
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
    ],
  })

  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddWeeklyTask, setShowAddWeeklyTask] = useState(false)
  const [showAddDailyTask, setShowAddDailyTask] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetCount: 0,
    weeklyTarget: 0,
  })

  const [newWeeklyTask, setNewWeeklyTask] = useState({
    title: "",
    description: "",
    category: "",
    goalId: "",
    priority: "medium" as const,
    estimatedHours: 1,
  })

  const [newDailyTask, setNewDailyTask] = useState({
    title: "",
    description: "",
    category: "",
    goalId: "",
    timeBlock: "",
    estimatedMinutes: 30,
  })

  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const [editingGoal, setEditingGoal] = useState<{ category: string; goal: Goal } | null>(null)
  const [showDeleteGoal, setShowDeleteGoal] = useState<{ category: string; goalId: string; title: string } | null>(null)
  const [showDeleteCategory, setShowDeleteCategory] = useState<string | null>(null)

  const [editingWeeklyTask, setEditingWeeklyTask] = useState<WeeklyTask | null>(null)
  const [editingDailyTask, setEditingDailyTask] = useState<DailyTask | null>(null)
  const [showDeleteWeeklyTask, setShowDeleteWeeklyTask] = useState<{ taskId: string; title: string } | null>(null)
  const [showDeleteDailyTask, setShowDeleteDailyTask] = useState<{ day: string; taskId: string; title: string } | null>(
    null,
  )

  const [customCategoryColors, setCustomCategoryColors] = useState<{ [key: string]: string }>({})
  const [showEditCategory, setShowEditCategory] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editCategoryColor, setEditCategoryColor] = useState("")

  // Add these state variables after the existing state declarations (around line 680):
  const [editingLongTermGoal, setEditingLongTermGoal] = useState<{
    timeframe: "1-year" | "5-year"
    category: string
    goal: LongTermGoal
  } | null>(null)
  const [showDeleteLongTermGoal, setShowDeleteLongTermGoal] = useState<{
    timeframe: "1-year" | "5-year"
    category: string
    goalId: string
    title: string
  } | null>(null)

  // Helper function to get user initials
  const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== "string") return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Cal.com inspired color palette for category badges - each category gets a unique, distinct color
  const getCategoryColor = (category: string) => {
    // Check for custom colors first
    if (customCategoryColors[category]) {
      return customCategoryColors[category]
    }

    const colors = {
      "Layson Group": "bg-sky-100 text-sky-800 border-sky-200",
      Upside: "bg-violet-100 text-violet-800 border-violet-200",
      "Poplar Title": "bg-purple-100 text-purple-800 border-purple-200",
      "Relationships/Family": "bg-pink-100 text-pink-800 border-pink-200",
      "Physical/Nutrition/Health": "bg-lime-100 text-lime-800 border-lime-200",
      "Spiritual/Contribution": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Intellect/Education": "bg-amber-100 text-amber-800 border-amber-200",
      "Lifestyle/Adventure": "bg-orange-100 text-orange-800 border-orange-200",
      "Personal Finance/Material": "bg-teal-100 text-teal-800 border-teal-200",
    }

    // Extended unique color palette for new categories
    const additionalColors = [
      "bg-slate-100 text-slate-800 border-slate-200",
      "bg-rose-100 text-rose-800 border-rose-200",
      "bg-cyan-100 text-cyan-800 border-cyan-200",
      "bg-emerald-100 text-emerald-800 border-emerald-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-red-100 text-red-800 border-red-200",
      "bg-sky-100 text-sky-800 border-sky-200",
      "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
      "bg-stone-100 text-stone-800 border-stone-200",
      "bg-zinc-100 text-zinc-800 border-zinc-800 border-zinc-200",
      "bg-neutral-100 text-neutral-800 border-neutral-200",
    ]

    // If category has a predefined color, use it
    if (colors[category]) {
      return colors[category]
    }

    // For new categories, assign a unique color from the additional palette
    const existingCategories = Object.keys(colors)
    const newCategoryIndex = Object.keys(colors).length + Object.keys(colors).filter((cat) => !colors[cat]).length

    return additionalColors[newCategoryIndex % additionalColors.length]
  }

  // Enhance the moveIncompleteTasks function to be more robust
  const moveIncompleteTasks = () => {
    // Get current date information
    const today = new Date()
    const currentDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
      today.getDay()
    ]
    const currentDayIndex = today.getDay()

    // Check if we need to move to a new week
    const lastWeekCheck = localStorage.getItem("lastWeekCheck")
    const currentWeekOfYear = Math.ceil((today.getDate() - today.getDay() + 1) / 7)
    const currentYear = today.getFullYear()
    const weekYearKey = `${currentYear}-${currentWeekOfYear}`

    if (lastWeekCheck !== weekYearKey) {
      // It's a new week, move incomplete weekly tasks
      const weekKey = `Week ${currentWeek}`
      const nextWeekKey = `Week ${currentWeek + 1}`

      // Get incomplete tasks from current week
      const currentWeekTasks = weeklyTasks[weekKey] || []
      const incompleteTasks = currentWeekTasks.filter((task) => !task.completed)

      if (incompleteTasks.length > 0) {
        setWeeklyTasks((prev) => {
          const updated = { ...prev }

          // Add incomplete tasks to next week with updated IDs
          const updatedTasksForNextWeek = incompleteTasks.map((task) => ({
            ...task,
            id: `w${currentWeek + 1}_moved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }))

          updated[nextWeekKey] = [...(prev[nextWeekKey] || []), ...updatedTasksForNextWeek]

          return updated
        })
      }

      // Update the week check
      localStorage.setItem("lastWeekCheck", weekYearKey)
    }

    // Handle daily tasks - move all incomplete tasks from previous days to today
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    // Get all days before today
    const previousDays = []
    for (let i = 0; i < 7; i++) {
      if (i !== currentDayIndex) {
        previousDays.push(allDays[i])
      }
    }

    let tasksToMove = []

    // Collect incomplete tasks from all days
    previousDays.forEach((day) => {
      const dayTasks = dailyTasks[day] || []
      const incompleteTasks = dayTasks.filter((task) => !task.completed)
      tasksToMove = [...tasksToMove, ...incompleteTasks]
    })

    if (tasksToMove.length > 0) {
      setDailyTasks((prev) => {
        const updated = { ...prev }

        // Add incomplete tasks to today with updated IDs
        const updatedTasksForToday = tasksToMove.map((task) => ({
          ...task,
          id: `${currentDayName.toLowerCase()}_moved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }))

        updated[currentDayName] = [...(prev[currentDayName] || []), ...updatedTasksForToday]

        return updated
      })
    }
  }

  // Replace the existing useEffect for moveIncompleteTasks with this enhanced version
  useEffect(() => {
    // Move incomplete tasks on component mount
    moveIncompleteTasks()

    // Set up a check for day change to move tasks automatically
    const checkForDayChange = () => {
      const now = new Date()
      const currentDay = now.getDay()
      const currentDate = now.getDate()

      // Store the current day and date in localStorage
      const storedDay = localStorage.getItem("lastCheckDay")
      const storedDate = localStorage.getItem("lastCheckDate")

      // If the day has changed since last check, move incomplete tasks
      if (storedDay !== null && storedDate !== null) {
        const lastDay = Number.parseInt(storedDay)
        const lastDate = Number.parseInt(storedDate)

        if (lastDay !== currentDay || lastDate !== currentDate) {
          moveIncompleteTasks()
        }
      }

      // Update the stored day and date
      localStorage.setItem("lastCheckDay", currentDay.toString())
      localStorage.setItem("lastCheckDate", currentDate.toString())
    }

    // Check for day change on mount and set interval to check periodically
    checkForDayChange()

    // Check every hour for day changes (in case the app stays open overnight)
    const intervalId = setInterval(checkForDayChange, 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const incrementGoal = (category: string, goalId: string, amount = 1) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) =>
        goal.id === goalId ? { ...goal, currentCount: Math.min(goal.currentCount + amount, goal.targetCount) } : goal,
      ),
    }))
  }

  const updateGoalProgress = (category: string, goalId: string, newValue: number) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) =>
        goal.id === goalId ? { ...goal, currentCount: Math.min(Math.max(newValue, 0), goal.targetCount) } : goal,
      ),
    }))
  }

  const toggleBinaryGoal = (category: string, goalId: string) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) =>
        goal.id === goalId ? { ...goal, currentCount: goal.currentCount === 0 ? goal.targetCount : 0 } : goal,
      ),
    }))
  }

  const toggleGoalCompletion = (category: string, goalId: string) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              currentCount:
                goal.currentCount >= goal.targetCount
                  ? Math.max(0, goal.targetCount - 1)
                  : // If complete, set to one less than target
                    goal.targetCount, // If not complete, mark as complete
            }
          : goal,
      ),
    }))
  }

  const getGoalType = (targetCount: number) => {
    if (targetCount === 1) return "binary"
    if (targetCount <= 20) return "small"
    if (targetCount <= 100) return "medium"
    return "large"
  }

  const getQuickIncrements = (targetCount: number) => {
    if (targetCount <= 100) return [1, 5, 10]
    if (targetCount <= 1000) return [1, 10, 50, 100]
    return [1, 100, 1000, 5000]
  }

  const addWeeklyTask = async () => {
    if (!newWeeklyTask.title || !newWeeklyTask.category) return

    const taskId = `w${currentWeek}_${Date.now()}`
    const weekKey = `Week ${currentWeek}`

    // Optimistic update to local state
    const newTask = {
      id: taskId,
      title: newWeeklyTask.title,
      description: newWeeklyTask.description,
      category: newWeeklyTask.category,
      goalId: newWeeklyTask.goalId,
      completed: false,
      priority: newWeeklyTask.priority,
      estimatedHours: newWeeklyTask.estimatedHours,
    }

    setWeeklyTasks((prev) => ({
      ...prev,
      [weekKey]: [...(prev[weekKey] || []), newTask],
    }))

    // Persist to Supabase
    try {
      const weekStartDate = new Date()
      weekStartDate.setDate(weekStartDate.getDate() + (currentWeek - 1) * 7)

      await createTask({
        title: newWeeklyTask.title,
        description: `WEEKLY|${newWeeklyTask.category}|${newWeeklyTask.description || ""}|${newWeeklyTask.priority}|${newWeeklyTask.estimatedHours}`,
        due_date: weekStartDate.toISOString(),
        goal_id: newWeeklyTask.goalId || null,
      })
    } catch (e) {
      console.error("Supabase create weekly task failed:", e instanceof Error ? e.message : String(e))
      // Revert optimistic update on error
      setWeeklyTasks((prev) => ({
        ...prev,
        [weekKey]: prev[weekKey]?.filter((task) => task.id !== taskId) || [],
      }))
    }

    setNewWeeklyTask({
      title: "",
      description: "",
      category: "",
      goalId: "",
      priority: "medium",
      estimatedHours: 1,
    })
    setShowAddWeeklyTask(false)
  }

  const addDailyTask = async () => {
    if (!newDailyTask.title || !newDailyTask.category) return

    const taskId = `${selectedDay.toLowerCase()}_${Date.now()}`

    // Optimistic update to local state
    const newTask = {
      id: taskId,
      title: newDailyTask.title,
      description: newDailyTask.description,
      category: newDailyTask.category,
      goalId: newDailyTask.goalId,
      completed: false,
      timeBlock: newDailyTask.timeBlock,
      estimatedMinutes: newDailyTask.estimatedMinutes,
    }

    setDailyTasks((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newTask],
    }))

    // Persist to Supabase
    try {
      const today = new Date()
      await createTask({
        title: newDailyTask.title,
        description: `DAILY|${newDailyTask.category}|${newDailyTask.description || ""}|${newDailyTask.timeBlock}|${newDailyTask.estimatedMinutes}`,
        due_date: today.toISOString(),
        goal_id: newDailyTask.goalId || null,
      })
    } catch (e) {
      console.error("Supabase create daily task failed:", e instanceof Error ? e.message : String(e))
      // Revert optimistic update on error
      setDailyTasks((prev) => ({
        ...prev,
        [selectedDay]: prev[selectedDay]?.filter((task) => task.id !== taskId) || [],
      }))
    }

    setNewDailyTask({
      title: "",
      description: "",
      category: "",
      goalId: "",
      timeBlock: "",
      estimatedMinutes: 30,
    })
    setShowAddDailyTask(false)
  }

  const toggleWeeklyTask = async (taskId: string) => {
    const weekKey = `Week ${currentWeek}`
    const currentTask = weeklyTasks[weekKey]?.find((task) => task.id === taskId)
    if (!currentTask) return

    const newCompleted = !currentTask.completed

    // Optimistic update
    setWeeklyTasks((prev) => ({
      ...prev,
      [weekKey]: prev[weekKey]?.map((task) => (task.id === taskId ? { ...task, completed: newCompleted } : task)) || [],
    }))

    // Persist to Supabase (if task has a database ID)
    try {
      if (currentTask.dbId) {
        await setTaskCompleted(currentTask.dbId, newCompleted)
      }
    } catch (e) {
      console.error("Failed to update task completion:", e instanceof Error ? e.message : String(e))
      // Revert optimistic update on error
      setWeeklyTasks((prev) => ({
        ...prev,
        [weekKey]:
          prev[weekKey]?.map((task) => (task.id === taskId ? { ...task, completed: !newCompleted } : task)) || [],
      }))
    }
  }

  const toggleDailyTask = async (day: string, taskId: string) => {
    const currentTask = dailyTasks[day]?.find((task) => task.id === taskId)
    if (!currentTask) return

    const newCompleted = !currentTask.completed

    // Optimistic update
    setDailyTasks((prev) => ({
      ...prev,
      [day]: prev[day]?.map((task) => (task.id === taskId ? { ...task, completed: newCompleted } : task)) || [],
    }))

    // Persist to Supabase (if task has a database ID)
    try {
      if (currentTask.dbId) {
        await setTaskCompleted(currentTask.dbId, newCompleted)
      }
    } catch (e) {
      console.error("Failed to update task completion:", e instanceof Error ? e.message : String(e))
      // Revert optimistic update on error
      setDailyTasks((prev) => ({
        ...prev,
        [day]: prev[day]?.map((task) => (task.id === taskId ? { ...task, completed: !newCompleted } : task)) || [],
      }))
    }
  }

  // Adding useEffect to hydrate tasks from Supabase
  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      try {
        const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false })
        if (error) throw error
        console.log("Hydrated tasks from Supabase:", data)

        if (data && data.length > 0) {
          // Separate tasks by type and merge into existing state
          const weeklyTasksFromDB: any = {}
          const dailyTasksFromDB: any = {}

          data.forEach((task: any) => {
            const taskObj = {
              id: task.id,
              title: task.title,
              description: task.description || "",
              completed: task.completed || false,
              goalId: task.goal_id,
              time: task.due_date
                ? new Date(task.due_date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "",
            }

            // Determine if it's a weekly or daily task based on due_date
            const dueDate = task.due_date ? new Date(task.due_date) : null
            const isWeeklyTask = dueDate && dueDate.getDay() !== new Date().getDay()

            if (isWeeklyTask) {
              // Add to weekly tasks - use a default category if none specified
              const category = "General"
              if (!weeklyTasksFromDB[category]) {
                weeklyTasksFromDB[category] = []
              }
              weeklyTasksFromDB[category].push(taskObj)
            } else {
              // Add to daily tasks - use a default category if none specified
              const category = "General"
              if (!dailyTasksFromDB[category]) {
                dailyTasksFromDB[category] = []
              }
              dailyTasksFromDB[category].push(taskObj)
            }
          })

          // Merge with existing state
          setWeeklyTasks((prev) => ({ ...prev, ...weeklyTasksFromDB }))
          setDailyTasks((prev) => ({ ...prev, ...dailyTasksFromDB }))
        }
      } catch (error: any) {
        if (error?.message?.includes("does not exist") || error?.message?.includes("schema cache")) {
          console.warn("Tasks table not found, using local state only")
        } else {
          console.error("Failed to hydrate tasks:", error.message || String(error))
        }
      }
    })()
  }, [])

  // Drag and drop handlers
  const handleWeeklyTaskDragEnd = (event: DragEndEvent, category: string) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const weekKey = `Week ${currentWeek}`
    const categoryTasks = (weeklyTasks[weekKey] || []).filter((task) => task.category === category)
    const oldIndex = categoryTasks.findIndex((task) => task.id === active.id)
    const newIndex = categoryTasks.findIndex((task) => task.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedTasks = arrayMove(categoryTasks, oldIndex, newIndex)

      setWeeklyTasks((prev) => ({
        ...prev,
        [weekKey]: [...(prev[weekKey] || []).filter((task) => task.category !== category), ...reorderedTasks],
      }))
    }
  }

  const handleDailyTaskDragEnd = (event: DragEndEvent, category: string) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const categoryTasks = (dailyTasks[selectedDay] || []).filter((task) => task.category === category)
    const oldIndex = categoryTasks.findIndex((task) => task.id === active.id)
    const newIndex = categoryTasks.findIndex((task) => task.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedTasks = arrayMove(categoryTasks, oldIndex, newIndex)

      setDailyTasks((prev) => ({
        ...prev,
        [selectedDay]: [...(prev[selectedDay] || []).filter((task) => task.category !== category), ...reorderedTasks],
      }))
    }
  }

  const updateNotes = (category: string, goalId: string, notes: string) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, notes } : goal)),
    }))
  }

  const toggleNotes = (goalId: string) => {
    setExpandedNotes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(goalId)) {
        newSet.delete(goalId)
      } else {
        newSet.add(goalId)
      }
      return newSet
    })
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getWeeklyProgress = (goal: Goal) => {
    const expectedProgress = goal.weeklyTarget * currentWeek
    const actualProgress = goal.currentCount
    return {
      expected: expectedProgress,
      actual: actualProgress,
      onTrack: actualProgress >= expectedProgress * 0.8,
    }
  }

  const getTotalProgress = () => {
    let totalCurrent = 0
    let totalTarget = 0

    Object.values(goalsData)
      .flat()
      .forEach((goal) => {
        const normalizedCurrent = goal.currentCount / goal.targetCount
        const normalizedTarget = 1
        totalCurrent += normalizedCurrent
        totalTarget += normalizedTarget
      })

    return Math.round((totalCurrent / totalTarget) * 100)
  }

  const getCompletedGoals = () => {
    return Object.values(goalsData)
      .flat()
      .filter((goal) => goal.currentCount >= goal.targetCount).length
  }

  const getTotalGoals = () => {
    return Object.values(goalsData).flat().length
  }

  const getCompletedTasks = () => {
    // Count completed weekly tasks
    const weeklyTasksCompleted = Object.values(weeklyTasks)
      .flat()
      .filter((task) => task.completed).length

    // Count completed daily tasks
    const dailyTasksCompleted = Object.values(dailyTasks)
      .flat()
      .filter((task) => task.completed).length

    return weeklyTasksCompleted + dailyTasksCompleted
  }

  const getTotalTasks = () => {
    // Count total weekly tasks
    const totalWeeklyTasks = Object.values(weeklyTasks).flat().length

    // Count total daily tasks
    const totalDailyTasks = Object.values(dailyTasks).flat().length

    return totalWeeklyTasks + totalDailyTasks
  }

  const addNewGoal = () => {
    const detectedNumber = extractNumberFromTitle(newGoal.title)
    const targetCount = detectedNumber > 0 ? newGoal.targetCount || detectedNumber : 1

    if (!selectedCategory || !newGoal.title) return

    const goalId = `${selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now()}`

    setGoalsData((prev) => ({
      ...prev,
      [selectedCategory]: [
        ...prev[selectedCategory],
        {
          id: goalId,
          title: newGoal.title,
          description: newGoal.description,
          targetCount: targetCount,
          currentCount: 0,
          notes: "",
          weeklyTarget: newGoal.weeklyTarget || targetCount / 12,
          category: selectedCategory,
        },
      ],
    }))

    setNewGoal({ title: "", description: "", targetCount: 0, weeklyTarget: 0 })
    setSelectedCategory("")
    setShowAddGoal(false)
  }

  const addNewCategory = () => {
    if (!newCategoryName.trim()) return

    // Convert to title case instead of uppercase
    const categoryName = newCategoryName
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    if (goalsData[categoryName]) {
      alert("Category already exists!")
      return
    }

    setGoalsData((prev) => ({
      ...prev,
      [categoryName]: [],
    }))

    setNewCategoryName("")
    setShowAddCategory(false)
  }

  const editGoal = (category: string, goalId: string, updatedGoal: Partial<Goal>) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, ...updatedGoal } : goal)),
    }))
  }

  const deleteGoal = (category: string, goalId: string) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].filter((goal) => goal.id !== goalId),
    }))
    setShowDeleteGoal(null)
  }

  const saveEditedGoal = () => {
    if (!editingGoal) return

    editGoal(editingGoal.category, editingGoal.goal.id, {
      title: newGoal.title,
      description: newGoal.description,
      targetCount: newGoal.targetCount,
      weeklyTarget: newGoal.weeklyTarget || newGoal.targetCount / 12,
    })

    setNewGoal({ title: "", description: "", targetCount: 0, weeklyTarget: 0 })
    setEditingGoal(null)
  }

  const startEditingGoal = (category: string, goal: Goal) => {
    setEditingGoal({ category, goal })
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetCount: goal.targetCount,
      weeklyTarget: goal.weeklyTarget,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const editWeeklyTask = (taskId: string, updatedTask: Partial<WeeklyTask>) => {
    setWeeklyTasks((prev) => ({
      ...prev,
      [`Week ${currentWeek}`]:
        prev[`Week ${currentWeek}`]?.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)) || [],
    }))
  }

  const deleteWeeklyTask = (taskId: string) => {
    setWeeklyTasks((prev) => ({
      ...prev,
      [`Week ${currentWeek}`]: prev[`Week ${currentWeek}`]?.filter((task) => task.id !== taskId) || [],
    }))
    setShowDeleteWeeklyTask(null)
  }

  const editDailyTask = (day: string, taskId: string, updatedTask: Partial<DailyTask>) => {
    setDailyTasks((prev) => ({
      ...prev,
      [day]: prev[day]?.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)) || [],
    }))
  }

  const deleteDailyTask = (day: string, taskId: string) => {
    setDailyTasks((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((task) => task.id !== taskId) || [],
    }))
    setShowDeleteDailyTask(null)
  }

  const startEditingWeeklyTask = (task: WeeklyTask) => {
    setEditingWeeklyTask(task)
    setNewWeeklyTask({
      title: task.title,
      description: task.description,
      category: task.category,
      goalId: task.goalId,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
    })
    setShowAddWeeklyTask(true)
  }

  const startEditingDailyTask = (task: DailyTask) => {
    setEditingDailyTask(task)
    setNewDailyTask({
      title: task.title,
      description: task.description,
      category: task.category,
      goalId: task.goalId,
      timeBlock: task.timeBlock,
      estimatedMinutes: task.estimatedMinutes,
    })
    setShowAddDailyTask(true)
  }

  const saveEditedWeeklyTask = () => {
    if (!editingWeeklyTask) return

    editWeeklyTask(editingWeeklyTask.id, {
      title: newWeeklyTask.title,
      description: newWeeklyTask.description,
      category: newWeeklyTask.category,
      goalId: newWeeklyTask.goalId,
      priority: newWeeklyTask.priority,
      estimatedHours: newWeeklyTask.estimatedHours,
    })

    setNewWeeklyTask({
      title: "",
      description: "",
      category: "",
      goalId: "",
      priority: "medium",
      estimatedHours: 1,
    })
    setEditingWeeklyTask(null)
    setShowAddWeeklyTask(false)
  }

  const saveEditedDailyTask = () => {
    if (!editingDailyTask) return

    editDailyTask(selectedDay, editingDailyTask.id, {
      title: newDailyTask.title,
      description: newDailyTask.description,
      category: newDailyTask.category,
      goalId: newDailyTask.goalId,
      timeBlock: newDailyTask.timeBlock,
      estimatedMinutes: newDailyTask.estimatedMinutes,
    })
    setEditingDailyTask(null)
    setShowAddDailyTask(false)
  }

  const colorOptions = [
    { name: "Blue", value: "bg-blue-100 text-blue-800 border-blue-200" },
    { name: "Sky", value: "bg-sky-100 text-sky-800 border-sky-200" },
    { name: "Violet", value: "bg-violet-100 text-violet-800 border-violet-200" },
    { name: "Purple", value: "bg-purple-100 text-purple-800 border-purple-200" },
    { name: "Pink", value: "bg-pink-100 text-pink-800 border-pink-200" },
    { name: "Rose", value: "bg-rose-100 text-rose-800 border-rose-200" },
    { name: "Red", value: "bg-red-100 text-red-800 border-red-200" },
    { name: "Orange", value: "bg-orange-100 text-orange-800 border-orange-200" },
    { name: "Amber", value: "bg-amber-100 text-amber-800 border-amber-200" },
    { name: "Yellow", value: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { name: "Lime", value: "bg-lime-100 text-lime-800 border-lime-200" },
    { name: "Green", value: "bg-green-100 text-green-800 border-green-200" },
    { name: "Emerald", value: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { name: "Teal", value: "bg-teal-100 text-teal-800 border-teal-200" },
    { name: "Cyan", value: "bg-cyan-100 text-cyan-800 border-cyan-200" },
    { name: "Slate", value: "bg-slate-100 text-slate-800 border-slate-200" },
    { name: "Gray", value: "bg-gray-100 text-gray-800 border-gray-200" },
    { name: "Stone", value: "bg-stone-100 text-stone-800 border-stone-200" },
  ]

  const editCategory = (categoryName: string, updatedName: string, updatedColor: string) => {
    // Update the category name in goalsData
    setGoalsData((prev) => {
      const updatedGoalsData: GoalsData = { ...prev }

      if (prev[categoryName]) {
        // Create a new entry with the updated name
        updatedGoalsData[updatedName] = prev[categoryName]

        // Update the category field in each goal
        updatedGoalsData[updatedName] = updatedGoalsData[updatedName].map((goal) => ({
          ...goal,
          category: updatedName,
        }))

        // Delete the old category
        delete updatedGoalsData[categoryName]
      }

      return updatedGoalsData
    })

    // Update the category name in weeklyTasks
    setWeeklyTasks((prev) => {
      const updatedWeeklyTasks = { ...prev }

      Object.keys(updatedWeeklyTasks).forEach((week) => {
        updatedWeeklyTasks[week] = updatedWeeklyTasks[week].map((task) =>
          task.category === categoryName ? { ...task, category: updatedName } : task,
        )
      })

      return updatedWeeklyTasks
    })

    // Update the category name in dailyTasks
    setDailyTasks((prev) => {
      const updatedDailyTasks = { ...prev }

      Object.keys(updatedDailyTasks).forEach((day) => {
        updatedDailyTasks[day] = updatedDailyTasks[day].map((task) =>
          task.category === categoryName ? { ...task, category: updatedName } : task,
        )
      })

      return updatedDailyTasks
    })

    // Update the custom category colors
    setCustomCategoryColors((prev) => {
      const updatedColors = { ...prev }

      if (prev[categoryName]) {
        updatedColors[updatedName] = updatedColor
        delete updatedColors[categoryName]
      }

      return updatedColors
    })
  }

  const deleteCategory = (categoryName: string) => {
    // Delete the category from goalsData
    setGoalsData((prev) => {
      const updatedGoalsData: GoalsData = { ...prev }
      delete updatedGoalsData[categoryName]
      return updatedGoalsData
    })

    // Remove tasks associated with the category from weeklyTasks
    setWeeklyTasks((prev) => {
      const updatedWeeklyTasks = { ...prev }

      Object.keys(updatedWeeklyTasks).forEach((week) => {
        updatedWeeklyTasks[week] = updatedWeeklyTasks[week].filter((task) => task.category !== categoryName)
      })

      return updatedWeeklyTasks
    })

    // Remove tasks associated with the category from dailyTasks
    setDailyTasks((prev) => {
      const updatedDailyTasks = { ...prev }

      Object.keys(updatedDailyTasks).forEach((day) => {
        updatedDailyTasks[day] = updatedDailyTasks[day].filter((task) => task.category !== categoryName)
      })

      return updatedDailyTasks
    })

    // Remove the custom category color
    setCustomCategoryColors((prev) => {
      const updatedColors = { ...prev }
      delete updatedColors[categoryName]
      return updatedColors
    })
  }

  const startEditingCategory = (categoryName: string) => {
    setShowEditCategory(categoryName)
    setEditCategoryName(categoryName)
    setEditCategoryColor(customCategoryColors[categoryName] || "")
  }

  const saveEditedCategory = () => {
    if (!showEditCategory) return

    editCategory(showEditCategory, editCategoryName, editCategoryColor)

    setShowEditCategory(null)
    setEditCategoryName("")
    setEditCategoryColor("")
  }

  return (
    <>
      {!user ? (
        <AuthScreen />
      ) : (
        <div className="min-h-screen bg-gray-100 py-6">
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800">Goal Tracker</h1>
                <p className="text-gray-500">Stay focused and achieve your goals.</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => setShowProfile(true)}>
                  <Avatar className="mr-2">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                    <AvatarFallback>{getInitials(user?.user_metadata?.full_name)}</AvatarFallback>
                  </Avatar>
                  {user?.user_metadata?.full_name || "Profile"}
                </Button>
                <SignOutButton />
              </div>
            </div>

            {/* Profile Dialog */}
            <Dialog open={showProfile} onOpenChange={setShowProfile}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>User Profile</DialogTitle>
                  <DialogDescription>Manage your profile information.</DialogDescription>
                </DialogHeader>
                <UserProfile user={user} />
                <DialogFooter>
                  <Button type="button" onClick={() => setShowProfile(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Progress</CardTitle>
                  <CardDescription>Overall progress across all goals.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Progress value={getTotalProgress()} className="flex-1" />
                    <span className="text-sm font-medium">{getTotalProgress()}%</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completed Goals</CardTitle>
                  <CardDescription>Number of goals achieved.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{getCompletedGoals()}</div>
                  <p className="text-sm text-gray-500">Out of {getTotalGoals()} goals</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completed Tasks</CardTitle>
                  <CardDescription>Number of tasks completed.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{getCompletedTasks()}</div>
                  <p className="text-sm text-gray-500">Out of {getTotalTasks()} tasks</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Current Week</CardTitle>
                  <CardDescription>Tracking progress for week {currentWeek}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold">{currentWeek}</span>
                    <Button variant="secondary" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="daily" className="mb-8">
              <TabsList>
                <TabsTrigger value="daily" onClick={() => setActiveView("daily")}>
                  Daily Tasks
                </TabsTrigger>
                <TabsTrigger value="weekly" onClick={() => setActiveView("weekly")}>
                  Weekly Tasks
                </TabsTrigger>
                <TabsTrigger value="goals" onClick={() => setActiveView("goals")}>
                  12-Week Goals
                </TabsTrigger>
                <TabsTrigger value="longterm" onClick={() => setActiveView("longterm")}>
                  Long-Term Goals
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                {/* Daily Tasks */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Daily Tasks</h2>
                  <div className="flex items-center space-x-4">
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setShowAddDailyTask(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>

                {/* Add Daily Task Dialog */}
                <Dialog open={showAddDailyTask} onOpenChange={setShowAddDailyTask}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingDailyTask ? "Edit Task" : "Add Daily Task"}</DialogTitle>
                      <DialogDescription>Create a new task for {selectedDay}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newDailyTask.title}
                          onChange={(e) => setNewDailyTask({ ...newDailyTask, title: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newDailyTask.description}
                          onChange={(e) => setNewDailyTask({ ...newDailyTask, description: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Select
                          value={newDailyTask.category}
                          onValueChange={(value) => setNewDailyTask({ ...newDailyTask, category: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(goalsData).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goalId" className="text-right">
                          Goal
                        </Label>
                        <Select
                          value={newDailyTask.goalId}
                          onValueChange={(value) => setNewDailyTask({ ...newDailyTask, goalId: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {newDailyTask.category &&
                              goalsData[newDailyTask.category]?.map((goal) => (
                                <SelectItem key={goal.id} value={goal.id}>
                                  {goal.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="timeBlock" className="text-right">
                          Time Block
                        </Label>
                        <Input
                          id="timeBlock"
                          type="time"
                          value={newDailyTask.timeBlock}
                          onChange={(e) => setNewDailyTask({ ...newDailyTask, timeBlock: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="estimatedMinutes" className="text-right">
                          Estimated Minutes
                        </Label>
                        <Input
                          id="estimatedMinutes"
                          type="number"
                          value={newDailyTask.estimatedMinutes.toString()}
                          onChange={(e) =>
                            setNewDailyTask({ ...newDailyTask, estimatedMinutes: Number.parseInt(e.target.value) })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setShowAddDailyTask(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={editingDailyTask ? saveEditedDailyTask : addDailyTask}>
                        {editingDailyTask ? "Update Task" : "Add Task"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Daily Tasks List */}
                {Object.keys(goalsData).map((category) => (
                  <div key={category} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-medium text-gray-700">
                        <Badge variant="secondary" className={getCategoryColor(category)}>
                          {category}
                        </Badge>
                      </h3>
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDailyTaskDragEnd(event, category)}
                    >
                      <SortableContext
                        items={(dailyTasks[selectedDay] || [])
                          .filter((task) => task.category === category)
                          .map((task) => task.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {(dailyTasks[selectedDay] || [])
                            .filter((task) => task.category === category)
                            .map((task) => (
                              <SortableDailyTaskItem
                                key={task.id}
                                task={task}
                                onToggle={() => toggleDailyTask(selectedDay, task.id)}
                                onEdit={() => startEditingDailyTask(task)}
                                onDelete={() =>
                                  setShowDeleteDailyTask({ day: selectedDay, taskId: task.id, title: task.title })
                                }
                              />
                            ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="weekly">
                {/* Weekly Tasks */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Weekly Tasks</h2>
                  <Button onClick={() => setShowAddWeeklyTask(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {/* Add Weekly Task Dialog */}
                <Dialog open={showAddWeeklyTask} onOpenChange={setShowAddWeeklyTask}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingWeeklyTask ? "Edit Task" : "Add Weekly Task"}</DialogTitle>
                      <DialogDescription>Create a new task for week {currentWeek}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newWeeklyTask.title}
                          onChange={(e) => setNewWeeklyTask({ ...newWeeklyTask, title: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newWeeklyTask.description}
                          onChange={(e) => setNewWeeklyTask({ ...newWeeklyTask, description: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Select
                          value={newWeeklyTask.category}
                          onValueChange={(value) => setNewWeeklyTask({ ...newWeeklyTask, category: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(goalsData).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goalId" className="text-right">
                          Goal
                        </Label>
                        <Select
                          value={newWeeklyTask.goalId}
                          onValueChange={(value) => setNewWeeklyTask({ ...newWeeklyTask, goalId: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {newWeeklyTask.category &&
                              goalsData[newWeeklyTask.category]?.map((goal) => (
                                <SelectItem key={goal.id} value={goal.id}>
                                  {goal.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                          Priority
                        </Label>
                        <Select
                          value={newWeeklyTask.priority}
                          onValueChange={(value) =>
                            setNewWeeklyTask({ ...newWeeklyTask, priority: value as "low" | "medium" | "high" })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="estimatedHours" className="text-right">
                          Estimated Hours
                        </Label>
                        <Input
                          id="estimatedHours"
                          type="number"
                          value={newWeeklyTask.estimatedHours.toString()}
                          onChange={(e) =>
                            setNewWeeklyTask({ ...newWeeklyTask, estimatedHours: Number.parseInt(e.target.value) })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setShowAddWeeklyTask(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={editingWeeklyTask ? saveEditedWeeklyTask : addWeeklyTask}>
                        {editingWeeklyTask ? "Update Task" : "Add Task"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Weekly Tasks List */}
                {Object.keys(goalsData).map((category) => (
                  <div key={category} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-medium text-gray-700">
                        <Badge variant="secondary" className={getCategoryColor(category)}>
                          {category}
                        </Badge>
                      </h3>
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleWeeklyTaskDragEnd(event, category)}
                    >
                      <SortableContext
                        items={(weeklyTasks[`Week ${currentWeek}`] || [])
                          .filter((task) => task.category === category)
                          .map((task) => task.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {(weeklyTasks[`Week ${currentWeek}`] || [])
                            .filter((task) => task.category === category)
                            .map((task) => (
                              <SortableWeeklyTaskItem
                                key={task.id}
                                task={task}
                                onToggle={() => toggleWeeklyTask(task.id)}
                                onEdit={() => startEditingWeeklyTask(task)}
                                onDelete={() => setShowDeleteWeeklyTask({ taskId: task.id, title: task.title })}
                                getPriorityColor={getPriorityColor}
                              />
                            ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="goals">
                {/* 12-Week Goals */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">12-Week Goals</h2>
                  <Button onClick={() => setShowAddGoal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </div>

                {/* Add Goal Dialog */}
                <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingGoal ? "Edit Goal" : "Add Goal"}</DialogTitle>
                      <DialogDescription>Create a new goal for the next 12 weeks.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(goalsData).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="secondary" size="icon" onClick={() => setShowAddCategory(true)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="targetCount" className="text-right">
                          Target Count
                        </Label>
                        <Input
                          id="targetCount"
                          type="number"
                          value={newGoal.targetCount.toString()}
                          onChange={(e) => setNewGoal({ ...newGoal, targetCount: Number.parseInt(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="weeklyTarget" className="text-right">
                          Weekly Target
                        </Label>
                        <Input
                          id="weeklyTarget"
                          type="number"
                          value={newGoal.weeklyTarget.toString()}
                          onChange={(e) => setNewGoal({ ...newGoal, weeklyTarget: Number.parseFloat(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setShowAddGoal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={editingGoal ? saveEditedGoal : addNewGoal}>
                        {editingGoal ? "Update Goal" : "Add Goal"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Add Category Dialog */}
                <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                      <DialogDescription>Create a new category for your goals.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categoryName" className="text-right">
                          Category Name
                        </Label>
                        <Input
                          id="categoryName"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setShowAddCategory(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={addNewCategory}>
                        Add Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Goals List */}
                {Object.keys(goalsData).map((category) => (
                  <div key={category} className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-medium text-gray-700">
                        <Badge variant="secondary" className={getCategoryColor(category)}>
                          {category}
                        </Badge>
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => startEditingCategory(category)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Category
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowDeleteCategory(category)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Category
                        </Button>
                      </div>
                    </div>

                    {/* Edit Category Dialog */}
                    <Dialog open={showEditCategory === category} onOpenChange={() => setShowEditCategory(null)}>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                          <DialogDescription>Edit the name and color of the category.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editCategoryName" className="text-right">
                              Category Name
                            </Label>
                            <Input
                              id="editCategoryName"
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editCategoryColor" className="text-right">
                              Category Color
                            </Label>
                            <Select value={editCategoryColor} onValueChange={setEditCategoryColor}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a color" />
                              </SelectTrigger>
                              <SelectContent>
                                {colorOptions.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    {color.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="secondary" onClick={() => setShowEditCategory(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" onClick={saveEditedCategory}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Category Confirmation Dialog */}
                    <Dialog open={showDeleteCategory === category} onOpenChange={() => setShowDeleteCategory(null)}>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Category</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete the category "{category}"? This will also delete all goals
                            and tasks associated with this category.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button type="button" variant="secondary" onClick={() => setShowDeleteCategory(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" variant="destructive" onClick={() => deleteCategory(category)}>
                            Delete Category
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {goalsData[category].map((goal) => (
                      <Card key={goal.id} className="mb-4">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {goal.title}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => startEditingGoal(category, goal)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Goal
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setShowDeleteGoal({ category: category, goalId: goal.id, title: goal.title })
                                  }
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Goal
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4 mb-2">
                            <Progress
                              value={getProgressPercentage(goal.currentCount, goal.targetCount)}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium">
                              {getProgressPercentage(goal.currentCount, goal.targetCount)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            <span>
                              <Target className="h-4 w-4 mr-1" />
                              {goal.currentCount} / {goal.targetCount}
                            </span>
                            <span>
                              <Calendar className="h-4 w-4 mr-1" />
                              {goal.weeklyTarget} weekly
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                            {getGoalType(goal.targetCount) !== "binary" && (
                              <>
                                <Button
                                  variant="secondary"
                                  size="xs"
                                  onClick={() => incrementGoal(category, goal.id, -1)}
                                >
                                  -
                                </Button>
                                {getQuickIncrements(goal.targetCount).map((increment) => (
                                  <Button
                                    key={increment}
                                    variant="secondary"
                                    size="xs"
                                    onClick={() => incrementGoal(category, goal.id, increment)}
                                  >
                                    +{increment}
                                  </Button>
                                ))}
                                <Button variant="secondary" size="xs" onClick={() => incrementGoal(category, goal.id)}>
                                  +
                                </Button>
                              </>
                            )}
                            {getGoalType(goal.targetCount) === "binary" && (
                              <Button variant="secondary" size="sm" onClick={() => toggleBinaryGoal(category, goal.id)}>
                                Toggle
                              </Button>
                            )}
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => toggleGoalCompletion(category, goal.id)}
                            >
                              Mark Complete
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Add notes..."
                            value={goal.notes}
                            onChange={(e) => updateNotes(category, goal.id, e.target.value)}
                            className="mb-2"
                          />
                          <Button variant="link" size="sm" onClick={() => toggleNotes(goal.id)}>
                            {expandedNotes.has(goal.id) ? "Hide Notes" : "Show Notes"}
                          </Button>
                          {expandedNotes.has(goal.id) && <p className="text-sm text-gray-600">{goal.notes}</p>}
                          {/* Weekly Progress Indicator */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">Weekly Progress</h4>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Expected: {goal.weeklyTarget * currentWeek}</span>
                              <span>Actual: {goal.currentCount}</span>
                            </div>
                            <Progress
                              value={Math.min((goal.currentCount / (goal.weeklyTarget * currentWeek)) * 100, 100)}
                              className="mb-2"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}

                {/* Delete Goal Confirmation Dialog */}
                <Dialog open={!!showDeleteGoal} onOpenChange={() => setShowDeleteGoal(null)}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete Goal</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the goal "{showDeleteGoal?.title}"? This action cannot be
                        undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setShowDeleteGoal(null)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="destructive"
                        onClick={() => deleteGoal(showDeleteGoal!.category, showDeleteGoal!.goalId)}
                      >
                        Delete Goal
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>
              <TabsContent value="longterm">
                {/* Long-Term Goals */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Long-Term Goals</h2>
                  <div className="flex items-center space-x-4">
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1-Year Goals</SelectItem>
                        <SelectItem value="5-year">5-Year Goals</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setShowAddLongTermGoal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>
                </div>

                {/* Add Long-Term Goal Dialog */}
                <Dialog open={showAddLongTermGoal} onOpenChange={setShowAddLongTermGoal}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingLongTermGoal ? "Edit Goal" : "Add Long-Term Goal"}</DialogTitle>
                      <DialogDescription>Create a new long-term goal.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newLongTermGoal.title}
                          onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, title: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newLongTermGoal.description}
                          onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, description: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="targetDate" className="text-right">
                          Target Date
                        </Label>
                        <Input
                          id="targetDate"
                          type="date"
                          value={newLongTermGoal.targetDate}
                          onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, targetDate: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Category
                        </Label>
                        <Select
                          value={newLongTermGoal.category}
                          onValueChange={(value) => setNewLongTermGoal({ ...newLongTermGoal, category: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(goalsData).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Notes
                        </Label>
                        <Textarea
                          id="notes"
                          value={newLongTermGoal.notes}
                          onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, notes: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      {/* Milestones */}
                      <h4 className="text-lg font-medium text-gray-700">Milestones</h4>
                      {newLongTermGoal.milestones.map((milestone, index) => (
                        <div key={index} className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor={`milestoneTitle${index}`} className="text-right">
                            Milestone {index + 1}
                          </Label>
                          <Input
                            id={`milestoneTitle${index}`}
                            value={milestone.title}
                            onChange={(e) => {
                              const updatedMilestones = [...newLongTermGoal.milestones]
                              updatedMilestones[index] = { ...milestone, title: e.target.value }
                              setNewLongTermGoal({ ...newLongTermGoal, milestones: updatedMilestones })
                            }}
                            className="col-span-2"
                          />
                          <Input
                            type="date"
                            value={milestone.targetDate}
                            onChange={(e) => {
                              const updatedMilestones = [...newLongTermGoal.milestones]
                              updatedMilestones[index] = { ...milestone, targetDate: e.target.value }
                              setNewLongTermGoal({ ...newLongTermGoal, milestones: updatedMilestones })
                            }}
                            className="col-span-1"
                          />
                        </div>
                      ))}
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="secondary" onClick={() => setShowAddLongTermGoal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={() => {}}>
                        {editingLongTermGoal ? "Update Goal" : "Add Goal"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Long-Term Goals List */}
                {longTermGoals[selectedTimeframe] &&
                  Object.keys(longTermGoals[selectedTimeframe]).map((category) => (
                    <div key={category} className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-medium text-gray-700">
                          <Badge variant="secondary" className={getCategoryColor(category)}>
                            {category}
                          </Badge>
                        </h3>
                      </div>
                      {longTermGoals[selectedTimeframe][category].map((goal) => (
                        <Card key={goal.id} className="mb-4">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {goal.title}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {}}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Goal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {}} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Goal
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardTitle>
                            <CardDescription>{goal.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-2">Target Date: {goal.targetDate}</p>
                            <p className="text-sm text-gray-600 mb-2">Notes: {goal.notes}</p>
                            <h4 className="text-sm font-medium text-gray-700">Milestones</h4>
                            <ul>
                              {goal.milestones.map((milestone) => (
                                <li key={milestone.id} className="flex items-center space-x-2">
                                  <Checkbox checked={milestone.completed} disabled />
                                  <span>{milestone.title}</span>
                                  <span>{milestone.targetDate}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ))}
              </TabsContent>
            </Tabs>

            {/* Delete Weekly Task Confirmation Dialog */}
            <Dialog open={!!showDeleteWeeklyTask} onOpenChange={() => setShowDeleteWeeklyTask(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Weekly Task</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the task "{showDeleteWeeklyTask?.title}"? This action cannot be
                    undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setShowDeleteWeeklyTask(null)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    onClick={() => deleteWeeklyTask(showDeleteWeeklyTask!.taskId)}
                  >
                    Delete Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Daily Task Confirmation Dialog */}
            <Dialog open={!!showDeleteDailyTask} onOpenChange={() => setShowDeleteDailyTask(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Daily Task</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the task "{showDeleteDailyTask?.title}"? This action cannot be
                    undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setShowDeleteDailyTask(null)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    onClick={() => deleteDailyTask(showDeleteDailyTask!.day, showDeleteDailyTask!.taskId)}
                  >
                    Delete Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </>
  )
}

export default GoalTrackerApp

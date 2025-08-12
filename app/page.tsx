"use client"
// Adding Supabase imports for goals and categories persistence
import { createGoal, updateGoalProgress, updateGoal, listGoals } from "@/lib/data/goals"
import { createCategory, listCategories, updateCategory } from "@/lib/data/categories"
import { logActivity } from "@/lib/data/activity"

import { useState, useEffect } from "react"
import {
  Plus,
  ChevronDown,
  ChevronUp,
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

// Auth components
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"

// Drag and Drop imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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

  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  // Adding loading states for goals and categories
  const [isLoadingGoals, setIsLoadingGoals] = useState(false)
  const [isCreatingGoal, setIsCreatingGoal] = useState(false)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

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
  const getInitials = (name: string) => {
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

  const incrementGoal = async (category: string, goalId: string, amount = 1) => {
    const currentGoal = goalsData[category]?.find((g) => g.id === goalId)
    if (!currentGoal) return

    const newCount = Math.min(currentGoal.currentCount + amount, currentGoal.targetCount)

    // Optimistic update for goal progress
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: newCount } : goal)),
    }))

    try {
      await updateGoalProgress(goalId, newCount)

      // Log activity
      await logActivity({
        actionType: "goal_progress_updated",
        entityType: "goal",
        entityId: goalId,
        details: { increment: amount, newCount, title: currentGoal.title },
      })
    } catch (error) {
      console.error("Failed to update goal progress:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) =>
          goal.id === goalId ? { ...goal, currentCount: currentGoal.currentCount } : goal,
        ),
      }))
    }
  }

  const updateGoalProgressLocal = async (category: string, goalId: string, newValue: number) => {
    const currentGoal = goalsData[category]?.find((g) => g.id === goalId)
    if (!currentGoal) return

    const clampedValue = Math.min(Math.max(newValue, 0), currentGoal.targetCount)

    // Optimistic update for direct goal progress changes
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: clampedValue } : goal)),
    }))

    try {
      // Fixed function call to use data layer function
      await updateGoalProgress(goalId, clampedValue)

      // Log activity
      await logActivity({
        actionType: "goal_progress_updated",
        entityType: "goal",
        entityId: goalId,
        details: { newCount: clampedValue, title: currentGoal.title },
      })
    } catch (error) {
      console.error("Failed to update goal progress:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) =>
          goal.id === goalId ? { ...goal, currentCount: currentGoal.currentCount } : goal,
        ),
      }))
    }
  }

  const toggleBinaryGoal = async (category: string, goalId: string) => {
    const currentGoal = goalsData[category]?.find((g) => g.id === goalId)
    if (!currentGoal) return

    const newCount = currentGoal.currentCount === 0 ? currentGoal.targetCount : 0

    // Optimistic update for binary goal toggle
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: newCount } : goal)),
    }))

    try {
      await updateGoalProgress(goalId, newCount)

      // Log activity
      await logActivity({
        actionType: newCount > 0 ? "goal_completed" : "goal_uncompleted",
        entityType: "goal",
        entityId: goalId,
        details: { title: currentGoal.title },
      })
    } catch (error) {
      console.error("Failed to toggle binary goal:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) =>
          goal.id === goalId ? { ...goal, currentCount: currentGoal.currentCount } : goal,
        ),
      }))
    }
  }

  const toggleGoalCompletion = async (category: string, goalId: string) => {
    const currentGoal = goalsData[category]?.find((g) => g.id === goalId)
    if (!currentGoal) return

    const newCount =
      currentGoal.currentCount >= currentGoal.targetCount
        ? Math.max(0, currentGoal.targetCount - 1)
        : currentGoal.targetCount

    // Optimistic update for goal completion toggle
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: newCount } : goal)),
    }))

    try {
      await updateGoalProgress(goalId, newCount)

      // Log activity
      await logActivity({
        actionType: newCount >= currentGoal.targetCount ? "goal_completed" : "goal_uncompleted",
        entityType: "goal",
        entityId: goalId,
        details: { title: currentGoal.title },
      })
    } catch (error) {
      console.error("Failed to toggle goal completion:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) =>
          goal.id === goalId ? { ...goal, currentCount: currentGoal.currentCount } : goal,
        ),
      }))
    }
  }

  const addNewGoal = async () => {
    const detectedNumber = extractNumberFromTitle(newGoal.title)
    const targetCount = detectedNumber > 0 ? newGoal.targetCount || detectedNumber : 1

    if (!selectedCategory || !newGoal.title) return

    setIsCreatingGoal(true)

    // Optimistic update for new goal creation
    const tempId = `temp_${Date.now()}`
    const optimisticGoal = {
      id: tempId,
      title: newGoal.title,
      description: newGoal.description,
      targetCount: targetCount,
      currentCount: 0,
      notes: "",
      weeklyTarget: newGoal.weeklyTarget || targetCount / 12,
      category: selectedCategory,
    }

    setGoalsData((prev) => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), optimisticGoal],
    }))

    try {
      const dbGoal = await createGoal({
        title: newGoal.title,
        description: newGoal.description,
        targetCount: targetCount,
        weeklyTarget: newGoal.weeklyTarget || targetCount / 12,
        category: selectedCategory,
      })

      // Replace optimistic goal with real goal
      setGoalsData((prev) => ({
        ...prev,
        [selectedCategory]:
          prev[selectedCategory]?.map((goal) => (goal.id === tempId ? { ...optimisticGoal, id: dbGoal.id } : goal)) ||
          [],
      }))

      // Log activity
      await logActivity({
        actionType: "goal_created",
        entityType: "goal",
        entityId: dbGoal.id,
        details: { title: newGoal.title, category: selectedCategory },
      })
    } catch (error) {
      console.error("Failed to create goal:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory]?.filter((goal) => goal.id !== tempId) || [],
      }))
    } finally {
      setIsCreatingGoal(false)
    }

    setNewGoal({ title: "", description: "", targetCount: 0, weeklyTarget: 0 })
    setSelectedCategory("")
    setShowAddGoal(false)
  }

  const addNewCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsCreatingCategory(true)

    // Convert to title case instead of uppercase
    const categoryName = newCategoryName
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    if (goalsData[categoryName]) {
      alert("Category already exists!")
      setIsCreatingCategory(false)
      return
    }

    // Optimistic update for new category creation
    setGoalsData((prev) => ({
      ...prev,
      [categoryName]: [],
    }))

    try {
      await createCategory({
        name: categoryName,
      })

      // Log activity
      await logActivity({
        actionType: "category_created",
        entityType: "category",
        details: { name: categoryName },
      })
    } catch (error) {
      console.error("Failed to create category:", error)
      // Rollback optimistic update
      setGoalsData((prev) => {
        const updated = { ...prev }
        delete updated[categoryName]
        return updated
      })
    } finally {
      setIsCreatingCategory(false)
    }

    setNewCategoryName("")
    setShowAddCategory(false)
  }

  const editGoal = async (category: string, goalId: string, updatedGoal: Partial<Goal>) => {
    const currentGoal = goalsData[category]?.find((g) => g.id === goalId)
    if (!currentGoal) return

    // Optimistic update for goal editing
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, ...updatedGoal } : goal)),
    }))

    try {
      await updateGoal(goalId, updatedGoal)

      // Log activity
      await logActivity({
        actionType: "goal_updated",
        entityType: "goal",
        entityId: goalId,
        details: { title: updatedGoal.title || currentGoal.title },
      })
    } catch (error) {
      console.error("Failed to update goal:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) => (goal.id === goalId ? currentGoal : goal)),
      }))
    }
  }

  const deleteGoalLocal = async (category: string, goalId: string) => {
    const currentGoal = goalsData[category]?.find((g) => g.id === goalId)
    if (!currentGoal) return

    // Optimistic update for goal deletion
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].filter((goal) => goal.id !== goalId),
    }))

    try {
      // Fixed function call to use data layer function with different name
      await deleteGoal(goalId)

      // Log activity
      await logActivity({
        actionType: "goal_deleted",
        entityType: "goal",
        entityId: goalId,
        details: { title: currentGoal.title, category },
      })
    } catch (error) {
      console.error("Failed to delete goal:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [category]: [...prev[category], currentGoal],
      }))
    }

    setShowDeleteGoal(null)
  }

  const saveEditedCategory = async () => {
    if (!showEditCategory || !editCategoryName.trim()) return

    const oldCategoryName = showEditCategory
    const newCategoryName = editCategoryName.trim()

    // Optimistic update for category editing
    // If name changed, update the goals data structure
    if (oldCategoryName !== newCategoryName) {
      setGoalsData((prev) => {
        const updated = { ...prev }

        // Move goals to new category name
        if (updated[oldCategoryName]) {
          updated[newCategoryName] = updated[oldCategoryName]
          delete updated[oldCategoryName]
        }

        return updated
      })

      // Update tasks to use new category name
      setWeeklyTasks((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((week) => {
          updated[week] = updated[week].map((task) =>
            task.category === oldCategoryName ? { ...task, category: newCategoryName } : task,
          )
        })
        return updated
      })

      setDailyTasks((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((day) => {
          updated[day] = updated[day].map((task) =>
            task.category === oldCategoryName ? { ...task, category: newCategoryName } : task,
          )
        })
        return updated
      })
    }

    // Update custom colors
    setCustomCategoryColors((prev) => {
      const updated = { ...prev }
      if (oldCategoryName !== newCategoryName && updated[oldCategoryName]) {
        updated[newCategoryName] = updated[oldCategoryName]
        delete updated[oldCategoryName]
      }
      updated[newCategoryName] = editCategoryColor
      return updated
    })

    try {
      // Update category in database
      const categories = await listCategories()
      const categoryToUpdate = categories.find((c) => c.name === oldCategoryName)

      if (categoryToUpdate) {
        await updateCategory(categoryToUpdate.id, {
          name: newCategoryName,
          color: editCategoryColor,
        })
      }

      // Log activity
      await logActivity({
        actionType: "category_updated",
        entityType: "category",
        details: { oldName: oldCategoryName, newName: newCategoryName },
      })
    } catch (error) {
      console.error("Failed to update category:", error)
      // Note: We don't rollback here as the UI changes are complex
      // The user can try again if needed
    }

    setShowEditCategory(null)
    setEditCategoryName("")
    setEditCategoryColor("")
  }

  const deleteCategoryLocal = async (category: string) => {
    // Optimistic update for category deletion
    setGoalsData((prev) => {
      const updated = { ...prev }
      delete updated[category]
      return updated
    })

    // Remove custom color if exists
    setCustomCategoryColors((prev) => {
      const updated = { ...prev }
      delete updated[category]
      return updated
    })

    try {
      const categories = await listCategories()
      const categoryToDelete = categories.find((c) => c.name === category)

      if (categoryToDelete) {
        // Fixed function call to use data layer function with different name
        await deleteCategory(categoryToDelete.id)
      }

      // Log activity
      await logActivity({
        actionType: "category_deleted",
        entityType: "category",
        details: { name: category },
      })
    } catch (error) {
      console.error("Failed to delete category:", error)
      // Rollback optimistic update
      setGoalsData((prev) => ({
        ...prev,
        [category]: [],
      }))
    }

    setShowDeleteCategory(null)
  }

  // Adding useEffect to load goals and categories from database
  useEffect(() => {
    const loadGoalsAndCategories = async () => {
      if (!user) return

      setIsLoadingGoals(true)
      try {
        // Load categories first
        const categories = await listCategories()

        // Load goals
        const goals = await listGoals()

        // Group goals by category
        const goalsGrouped: GoalsData = {}

        // Initialize all categories (including empty ones)
        categories.forEach((category) => {
          goalsGrouped[category.name] = []
          if (category.color) {
            setCustomCategoryColors((prev) => ({
              ...prev,
              [category.name]: category.color!,
            }))
          }
        })

        // Add goals to their categories
        goals.forEach((goal) => {
          const categoryName = goal.categories?.name || "Uncategorized"
          if (!goalsGrouped[categoryName]) {
            goalsGrouped[categoryName] = []
          }

          goalsGrouped[categoryName].push({
            id: goal.id,
            title: goal.title,
            description: goal.description || "",
            targetCount: goal.target_count,
            currentCount: goal.current_count,
            notes: goal.notes || "",
            weeklyTarget: goal.weekly_target,
            category: categoryName,
          })
        })

        // Only update if we have data or if it's different from initial data
        if (categories.length > 0 || goals.length > 0) {
          setGoalsData(goalsGrouped)
        }
      } catch (error) {
        console.error("Failed to load goals and categories:", error)
      } finally {
        setIsLoadingGoals(false)
      }
    }

    loadGoalsAndCategories()
  }, [user])

  const updateNotes = async (category: string, goalId: string, notes: string) => {
    // Optimistic update for goal notes
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, notes } : goal)),
    }))

    try {
      await updateGoal(goalId, { notes })
    } catch (error) {
      console.error("Failed to update goal notes:", error)
      // Note: We don't rollback notes changes as they're not critical
    }
  }

  const handleWeeklyDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setWeeklyTasks((prev) => {
        const oldIndex = prev[`Week ${currentWeek}`].findIndex((task) => task.id === active.id)
        const newIndex = prev[`Week ${currentWeek}`].findIndex((task) => task.id === over.id)

        const updatedTasks = [...prev[`Week ${currentWeek}`]]
        updatedTasks.splice(newIndex, 0, updatedTasks.splice(oldIndex, 1)[0])

        return { ...prev, [`Week ${currentWeek}`]: updatedTasks }
      })
    }
  }

  const handleDailyDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setDailyTasks((prev) => {
        const updatedDay = selectedDay
        const oldIndex = prev[updatedDay].findIndex((task) => task.id === active.id)
        const newIndex = prev[updatedDay].findIndex((task) => task.id === over.id)

        const updatedTasks = [...prev[updatedDay]]
        updatedTasks.splice(newIndex, 0, updatedTasks.splice(oldIndex, 1)[0])

        return { ...prev, [updatedDay]: updatedTasks }
      })
    }
  }

  const toggleWeeklyTaskCompletion = (taskId: string) => {
    setWeeklyTasks((prev) => {
      const updatedWeek = `Week ${currentWeek}`
      const updatedTasks = prev[updatedWeek].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      )
      return { ...prev, [updatedWeek]: updatedTasks }
    })
  }

  const toggleDailyTaskCompletion = (day: string, taskId: string) => {
    setDailyTasks((prev) => {
      const updatedTasks = prev[day].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      )
      return { ...prev, [day]: updatedTasks }
    })
  }

  const addNewWeeklyTask = () => {
    if (!newWeeklyTask.title || !newWeeklyTask.category) return

    setIsCreatingTask(true)

    const tempId = `temp_${Date.now()}`
    const optimisticTask = {
      id: tempId,
      title: newWeeklyTask.title,
      description: newWeeklyTask.description,
      category: newWeeklyTask.category,
      goalId: newWeeklyTask.goalId,
      completed: false,
      priority: newWeeklyTask.priority,
      estimatedHours: newWeeklyTask.estimatedHours,
    }

    setWeeklyTasks((prev) => {
      const updatedWeek = `Week ${currentWeek}`
      const updatedTasks = [...(prev[updatedWeek] || []), optimisticTask]
      return { ...prev, [updatedWeek]: updatedTasks }
    })

    // Simulate API call
    setTimeout(() => {
      setIsCreatingTask(false)
      setNewWeeklyTask({
        title: "",
        description: "",
        category: "",
        goalId: "",
        priority: "medium",
        estimatedHours: 1,
      })
      setShowAddWeeklyTask(false)
    }, 500)
  }

  const addNewDailyTask = () => {
    if (!newDailyTask.title || !newDailyTask.category) return

    setIsCreatingTask(true)

    const tempId = `temp_${Date.now()}`
    const optimisticTask = {
      id: tempId,
      title: newDailyTask.title,
      description: newDailyTask.description,
      category: newDailyTask.category,
      goalId: newDailyTask.goalId,
      completed: false,
      timeBlock: newDailyTask.timeBlock,
      estimatedMinutes: newDailyTask.estimatedMinutes,
    }

    setDailyTasks((prev) => {
      const updatedDay = selectedDay
      const updatedTasks = [...(prev[updatedDay] || []), optimisticTask]
      return { ...prev, [updatedDay]: updatedTasks }
    })

    // Simulate API call
    setTimeout(() => {
      setIsCreatingTask(false)
      setNewDailyTask({
        title: "",
        description: "",
        category: "",
        goalId: "",
        timeBlock: "",
        estimatedMinutes: 30,
      })
      setShowAddDailyTask(false)
    }, 500)
  }

  const saveEditedWeeklyTask = () => {
    if (!editingWeeklyTask) return

    setWeeklyTasks((prev) => {
      const updatedWeek = `Week ${currentWeek}`
      const updatedTasks = prev[updatedWeek].map((task) =>
        task.id === editingWeeklyTask.id ? editingWeeklyTask : task,
      )
      return { ...prev, [updatedWeek]: updatedTasks }
    })

    setEditingWeeklyTask(null)
  }

  const saveEditedDailyTask = () => {
    if (!editingDailyTask) return

    setDailyTasks((prev) => {
      const updatedDay = selectedDay
      const updatedTasks = prev[updatedDay].map((task) => (task.id === editingDailyTask.id ? editingDailyTask : task))
      return { ...prev, [updatedDay]: updatedTasks }
    })

    setEditingDailyTask(null)
  }

  const deleteWeeklyTask = (taskId: string) => {
    setWeeklyTasks((prev) => {
      const updatedWeek = `Week ${currentWeek}`
      const updatedTasks = prev[updatedWeek].filter((task) => task.id !== taskId)
      return { ...prev, [updatedWeek]: updatedTasks }
    })

    setShowDeleteWeeklyTask(null)
  }

  const deleteDailyTask = (day: string, taskId: string) => {
    setDailyTasks((prev) => {
      const updatedTasks = prev[day].filter((task) => task.id !== taskId)
      return { ...prev, [day]: updatedTasks }
    })

    setShowDeleteDailyTask(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Goal Tracker</h1>
          {user ? (
            <div className="flex items-center space-x-4">
              <Avatar onClick={() => setShowProfile(!showProfile)} className="cursor-pointer">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback>{getInitials(user.name || "User")}</AvatarFallback>
              </Avatar>
              {showProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8">
                      {user.name} <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <a href="/profile" target="_blank" rel="noopener noreferrer">
                        Profile
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SignOutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ) : (
            <div>
              <a href="/sign-in" className="text-blue-500">
                Sign In
              </a>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily" onClick={() => setActiveView("daily")}>
                Daily Tasks
              </TabsTrigger>
              <TabsTrigger value="weekly" onClick={() => setActiveView("weekly")}>
                Weekly Tasks
              </TabsTrigger>
              <TabsTrigger value="goals">12-Week Goals</TabsTrigger>
              <TabsTrigger value="longterm">Long-Term Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedDay} Tasks - Week {currentWeek}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAddDailyTask(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {isLoadingTasks ? (
                <div>Loading tasks...</div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDailyDragEnd}>
                  <SortableContext
                    items={(dailyTasks[selectedDay] || []).map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid gap-4">
                      {(dailyTasks[selectedDay] || []).map((task) => (
                        <SortableDailyTaskItem
                          key={task.id}
                          task={task}
                          onToggle={() => toggleDailyTaskCompletion(selectedDay, task.id)}
                          onEdit={() => setEditingDailyTask(task)}
                          onDelete={() =>
                            setShowDeleteDailyTask({ day: selectedDay, taskId: task.id, title: task.title })
                          }
                        />
                      ))}
                      {dailyTasks[selectedDay] === undefined || dailyTasks[selectedDay].length === 0 ? (
                        <div className="text-gray-500">No tasks for this day.</div>
                      ) : null}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>
            <TabsContent value="weekly">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Weekly Tasks - Week {currentWeek}</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAddWeeklyTask(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentWeek((prev) => Math.max(1, prev - 1))}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <span>Week {currentWeek}</span>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentWeek((prev) => prev + 1)}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {isLoadingTasks ? (
                <div>Loading tasks...</div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleWeeklyDragEnd}>
                  <SortableContext
                    items={(weeklyTasks[`Week ${currentWeek}`] || []).map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid gap-4">
                      {(weeklyTasks[`Week ${currentWeek}`] || []).map((task) => (
                        <SortableWeeklyTaskItem
                          key={task.id}
                          task={task}
                          onToggle={() => toggleWeeklyTaskCompletion(task.id)}
                          onEdit={() => setEditingWeeklyTask(task)}
                          onDelete={() => setShowDeleteWeeklyTask({ taskId: task.id, title: task.title })}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                      {weeklyTasks[`Week ${currentWeek}`] === undefined ||
                      weeklyTasks[`Week ${currentWeek}`].length === 0 ? (
                        <div className="text-gray-500">No tasks for this week.</div>
                      ) : null}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>
            <TabsContent value="goals">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">12-Week Goals</h2>
                <Button variant="outline" size="sm" onClick={() => setShowAddGoal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
              {isLoadingGoals ? (
                <div>Loading goals...</div>
              ) : (
                <div className="grid gap-4">
                  {Object.entries(goalsData).map(([category, goals]) => (
                    <Card key={category} className="border-2">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">{category}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button variant="secondary" size="icon" onClick={() => setShowEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => setShowDeleteCategory(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {goals.map((goal) => (
                            <Card key={goal.id} className="shadow-sm">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-xl font-semibold">{goal.title}</CardTitle>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => setEditingGoal({ category, goal })}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Goal
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setShowDeleteGoal({ category, goalId: goal.id, title: goal.title })
                                        }
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Goal
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <CardDescription>{goal.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="w-3/4">
                                    <Progress value={(goal.currentCount / goal.targetCount) * 100} className="h-4" />
                                  </div>
                                  <div className="w-1/4 text-right font-medium">
                                    {goal.currentCount} / {goal.targetCount}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => incrementGoal(category, goal.id)}
                                  >
                                    +1
                                  </Button>
                                  <Input
                                    type="number"
                                    min="0"
                                    max={goal.targetCount}
                                    value={goal.currentCount}
                                    onChange={(e) => {
                                      const newValue = Number.parseInt(e.target.value)
                                      if (!isNaN(newValue)) {
                                        // Fixed function call to use local function
                                        updateGoalProgressLocal(category, goal.id, newValue)
                                      }
                                    }}
                                    className="w-24 text-right"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleGoalCompletion(category, goal.id)}
                                  >
                                    {goal.currentCount >= goal.targetCount ? "Uncomplete" : "Complete"}
                                  </Button>
                                </div>
                                <div className="mt-4">
                                  <Badge variant="secondary" className={getCategoryColor(goal.category)}>
                                    {goal.category}
                                  </Badge>
                                </div>
                                <div className="mt-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">Notes</h4>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() =>
                                        setExpandedNotes((prev) => {
                                          const newSet = new Set(prev)
                                          if (newSet.has(goal.id)) {
                                            newSet.delete(goal.id)
                                          } else {
                                            newSet.add(goal.id)
                                          }
                                          return newSet
                                        })
                                      }
                                    >
                                      {expandedNotes.has(goal.id) ? "Hide" : "Show"}
                                      <ChevronDown
                                        className={`h-4 w-4 ml-2 ${expandedNotes.has(goal.id) ? "rotate-180" : ""}`}
                                      />
                                    </Button>
                                  </div>
                                  {expandedNotes.has(goal.id) && (
                                    <Textarea
                                      placeholder="Goal notes..."
                                      value={goal.notes}
                                      onChange={(e) => updateNotes(category, goal.id, e.target.value)}
                                      className="mt-2"
                                    />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {Object.keys(goalsData).length === 0 && <div className="text-gray-500">No goals created yet.</div>}
                </div>
              )}
            </TabsContent>
            <TabsContent value="longterm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Long-Term Goals</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAddLongTermGoal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                  <Select
                    value={selectedTimeframe}
                    onValueChange={(value) => setSelectedTimeframe(value as "1-year" | "5-year")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-year">1-Year Goals</SelectItem>
                      <SelectItem value="5-year">5-Year Goals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4">
                {longTermGoals[selectedTimeframe] &&
                  Object.entries(longTermGoals[selectedTimeframe]).map(([category, goals]) => (
                    <Card key={category} className="border-2">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">{category}</CardTitle>
                        {/* Add edit and delete category buttons here if needed */}
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {goals.map((goal) => (
                            <Card key={goal.id} className="shadow-sm">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-xl font-semibold">{goal.title}</CardTitle>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setEditingLongTermGoal({ timeframe: selectedTimeframe, category, goal })
                                        }
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Goal
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setShowDeleteLongTermGoal({
                                            timeframe: selectedTimeframe,
                                            category,
                                            goalId: goal.id,
                                            title: goal.title,
                                          })
                                        }
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Goal
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <CardDescription>{goal.description}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium">Target Date</h4>
                                  <p className="text-gray-600">{goal.targetDate}</p>
                                </div>
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium">Status</h4>
                                  <Badge variant="secondary">{goal.status}</Badge>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Milestones</h4>
                                  <ul className="list-disc pl-5">
                                    {goal.milestones.map((milestone) => (
                                      <li key={milestone.id} className="flex items-center space-x-2">
                                        <Checkbox checked={milestone.completed} disabled className={checkboxStyles} />
                                        <span>{milestone.title}</span>
                                        <span className="text-gray-500 text-xs">({milestone.targetDate})</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium">Notes</h4>
                                  <Textarea placeholder="Goal notes..." value={goal.notes} readOnly className="mt-2" />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {longTermGoals[selectedTimeframe] && Object.keys(longTermGoals[selectedTimeframe]).length === 0 && (
                  <div className="text-gray-500">No long-term goals created yet.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>Create a new 12-week goal to track your progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory} className="col-span-3">
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(goalsData).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem
                    value="add_new_category"
                    onClick={() => {
                      setShowAddGoal(false)
                      setShowAddCategory(true)
                    }}
                  >
                    Add New Category
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
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
              <Label htmlFor="targetCount" className="text-right">
                Target Count
              </Label>
              <Input
                type="number"
                id="targetCount"
                value={newGoal.targetCount}
                onChange={(e) => setNewGoal({ ...newGoal, targetCount: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weeklyTarget" className="text-right">
                Weekly Target
              </Label>
              <Input
                type="number"
                id="weeklyTarget"
                value={newGoal.weeklyTarget}
                onChange={(e) => setNewGoal({ ...newGoal, weeklyTarget: Number.parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowAddGoal(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={addNewGoal} disabled={isCreatingGoal}>
              {isCreatingGoal ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddLongTermGoal} onOpenChange={setShowAddLongTermGoal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Long-Term Goal</DialogTitle>
            <DialogDescription>Create a new long-term goal to track your progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newLongTermGoal.category}
                onValueChange={(value) => setNewLongTermGoal({ ...newLongTermGoal, category: value })}
                className="col-span-3"
              >
                <SelectTrigger>
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
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
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
                type="date"
                id="targetDate"
                value={newLongTermGoal.targetDate}
                onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, targetDate: e.target.value })}
                className="col-span-3"
              />
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
            {newLongTermGoal.milestones.map((milestone, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`milestoneTitle${index}`} className="text-right">
                  Milestone {index + 1}
                </Label>
                <Input
                  type="text"
                  id={`milestoneTitle${index}`}
                  value={milestone.title}
                  onChange={(e) => {
                    const newMilestones = [...newLongTermGoal.milestones]
                    newMilestones[index] = { ...milestone, title: e.target.value }
                    setNewLongTermGoal({ ...newLongTermGoal, milestones: newMilestones })
                  }}
                  className="col-span-2"
                />
                <Input
                  type="date"
                  id={`milestoneDate${index}`}
                  value={milestone.targetDate}
                  onChange={(e) => {
                    const newMilestones = [...newLongTermGoal.milestones]
                    newMilestones[index] = { ...milestone, targetDate: e.target.value }
                    setNewLongTermGoal({ ...newLongTermGoal, milestones: newMilestones })
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
            <Button
              type="submit"
              onClick={() => {
                // Handle adding long-term goal logic here
                setShowAddLongTermGoal(false)
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddWeeklyTask} onOpenChange={setShowAddWeeklyTask}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Weekly Task</DialogTitle>
            <DialogDescription>Create a new weekly task to track your progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newWeeklyTask.category}
                onValueChange={(value) => setNewWeeklyTask({ ...newWeeklyTask, category: value })}
                className="col-span-3"
              >
                <SelectTrigger>
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
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {goalsData[newWeeklyTask.category]?.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
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
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={newWeeklyTask.priority}
                onValueChange={(value) =>
                  setNewWeeklyTask({ ...newWeeklyTask, priority: value as "low" | "medium" | "high" })
                }
                className="col-span-3"
              >
                <SelectTrigger>
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
                type="number"
                id="estimatedHours"
                value={newWeeklyTask.estimatedHours}
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
            <Button type="submit" onClick={addNewWeeklyTask} disabled={isCreatingTask}>
              {isCreatingTask ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDailyTask} onOpenChange={setShowAddDailyTask}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Daily Task</DialogTitle>
            <DialogDescription>Create a new daily task to track your progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newDailyTask.category}
                onValueChange={(value) => setNewDailyTask({ ...newDailyTask, category: value })}
                className="col-span-3"
              >
                <SelectTrigger>
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
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {goalsData[newDailyTask.category]?.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
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
              <Label htmlFor="timeBlock" className="text-right">
                Time Block
              </Label>
              <Input
                type="text"
                id="timeBlock"
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
                type="number"
                id="estimatedMinutes"
                value={newDailyTask.estimatedMinutes}
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
            <Button type="submit" onClick={addNewDailyTask} disabled={isCreatingTask}>
              {isCreatingTask ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new category for your goals.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Category Name
              </Label>
              <Input
                type="text"
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
            <Button type="submit" onClick={addNewCategory} disabled={isCreatingCategory}>
              {isCreatingCategory ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingGoal !== null} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Edit an existing 12-week goal.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                value={editingGoal?.goal.title || ""}
                onChange={(e) =>
                  setEditingGoal((prev) => (prev ? { ...prev, goal: { ...prev.goal, title: e.target.value } } : null))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editingGoal?.goal.description || ""}
                onChange={(e) =>
                  setEditingGoal((prev) =>
                    prev ? { ...prev, goal: { ...prev.goal, description: e.target.value } } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetCount" className="text-right">
                Target Count
              </Label>
              <Input
                type="number"
                id="targetCount"
                value={editingGoal?.goal.targetCount || 0}
                onChange={(e) =>
                  setEditingGoal((prev) =>
                    prev ? { ...prev, goal: { ...prev.goal, targetCount: Number.parseInt(e.target.value) } } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weeklyTarget" className="text-right">
                Weekly Target
              </Label>
              <Input
                type="number"
                id="weeklyTarget"
                value={editingGoal?.goal.weeklyTarget || 0}
                onChange={(e) =>
                  setEditingGoal((prev) =>
                    prev ? { ...prev, goal: { ...prev.goal, weeklyTarget: Number.parseFloat(e.target.value) } } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditingGoal(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                if (editingGoal) {
                  editGoal(editingGoal.category, editingGoal.goal.id, {
                    title: editingGoal.goal.title,
                    description: editingGoal.goal.description,
                    targetCount: editingGoal.goal.targetCount,
                    weeklyTarget: editingGoal.goal.weeklyTarget,
                  })
                }
                setEditingGoal(null)
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingLongTermGoal !== null} onOpenChange={() => setEditingLongTermGoal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Long-Term Goal</DialogTitle>
            <DialogDescription>Edit an existing long-term goal.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                value={editingLongTermGoal?.goal.title || ""}
                onChange={(e) =>
                  setEditingLongTermGoal((prev) =>
                    prev ? { ...prev, goal: { ...prev.goal, title: e.target.value } } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editingLongTermGoal?.goal.description || ""}
                onChange={(e) =>
                  setEditingLongTermGoal((prev) =>
                    prev ? { ...prev, goal: { ...prev.goal, description: e.target.value } } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetDate" className="text-right">
                Target Date
              </Label>
              <Input
                type="date"
                id="targetDate"
                value={editingLongTermGoal?.goal.targetDate || ""}
                onChange={(e) =>
                  setEditingLongTermGoal((prev) =>
                    prev ? { ...prev, goal: { ...prev.goal, targetDate: e.target.value } } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={editingLongTermGoal?.goal.notes || ""}
                onChange={(e) =>
                  setEditingLongTermGoal((prev) =>
                    prev ? { ...prev, goal: { ...prev.goal, notes: e.target.value } } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
            {editingLongTermGoal?.goal.milestones.map((milestone, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`milestoneTitle${index}`} className="text-right">
                  Milestone {index + 1}
                </Label>
                <Input
                  type="text"
                  id={`milestoneTitle${index}`}
                  value={milestone.title}
                  onChange={(e) =>
                    setEditingLongTermGoal((prev) => {
                      if (!prev) return null
                      const newMilestones = [...prev.goal.milestones]
                      newMilestones[index] = { ...milestone, title: e.target.value }
                      return { ...prev, goal: { ...prev.goal, milestones: newMilestones } }
                    })
                  }
                  className="col-span-2"
                />
                <Input
                  type="date"
                  id={`milestoneDate${index}`}
                  value={milestone.targetDate}
                  onChange={(e) =>
                    setEditingLongTermGoal((prev) => {
                      if (!prev) return null
                      const newMilestones = [...prev.goal.milestones]
                      newMilestones[index] = { ...milestone, targetDate: e.target.value }
                      return { ...prev, goal: { ...prev.goal, milestones: newMilestones } }
                    })
                  }
                  className="col-span-1"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditingLongTermGoal(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                // Handle saving edited long-term goal logic here
                setEditingLongTermGoal(null)
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteGoal !== null} onOpenChange={() => setShowDeleteGoal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{showDeleteGoal?.title}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowDeleteGoal(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                if (showDeleteGoal) {
                  // Fixed function call to use local function
                  deleteGoalLocal(showDeleteGoal.category, showDeleteGoal.goalId)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteLongTermGoal !== null} onOpenChange={() => setShowDeleteLongTermGoal(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Long-Term Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{showDeleteLongTermGoal?.title}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowDeleteLongTermGoal(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                // Handle deleting long-term goal logic here
                setShowDeleteLongTermGoal(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteWeeklyTask !== null} onOpenChange={() => setShowDeleteWeeklyTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Weekly Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{showDeleteWeeklyTask?.title}</strong>? This action cannot be
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
              onClick={() => {
                if (showDeleteWeeklyTask) {
                  deleteWeeklyTask(showDeleteWeeklyTask.taskId)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDailyTask !== null} onOpenChange={() => setShowDeleteDailyTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Daily Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{showDeleteDailyTask?.title}</strong>? This action cannot be
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
              onClick={() => {
                if (showDeleteDailyTask) {
                  deleteDailyTask(showDeleteDailyTask.day, showDeleteDailyTask.taskId)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteCategory !== null} onOpenChange={() => setShowDeleteCategory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the <strong>{showDeleteCategory}</strong> category? All goals in this
              category will be deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowDeleteCategory(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => {
                if (showDeleteCategory) {
                  // Fixed function call to use local function
                  deleteCategoryLocal(showDeleteCategory)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditCategory !== null} onOpenChange={() => setShowEditCategory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Edit the name and color of the <strong>{showEditCategory}</strong> category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editCategoryName" className="text-right">
                Category Name
              </Label>
              <Input
                type="text"
                id="editCategoryName"
                value={editCategoryName || showEditCategory || ""}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editCategoryColor" className="text-right">
                Category Color
              </Label>
              <Input
                type="color"
                id="editCategoryColor"
                value={editCategoryColor}
                onChange={(e) => setEditCategoryColor(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowEditCategory(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={saveEditedCategory}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingWeeklyTask !== null} onOpenChange={() => setEditingWeeklyTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Weekly Task</DialogTitle>
            <DialogDescription>Edit an existing weekly task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                value={editingWeeklyTask?.title || ""}
                onChange={(e) => setEditingWeeklyTask((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editingWeeklyTask?.description || ""}
                onChange={(e) =>
                  setEditingWeeklyTask((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={editingWeeklyTask?.category || ""}
                onValueChange={(value) => setEditingWeeklyTask((prev) => (prev ? { ...prev, category: value } : null))}
                className="col-span-3"
              >
                <SelectTrigger>
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
                value={editingWeeklyTask?.goalId || ""}
                onValueChange={(value) => setEditingWeeklyTask((prev) => (prev ? { ...prev, goalId: value } : null))}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {goalsData[editingWeeklyTask?.category || ""]?.map((goal) => (
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
                value={editingWeeklyTask?.priority || ""}
                onValueChange={(value) =>
                  setEditingWeeklyTask((prev) =>
                    prev ? { ...prev, priority: value as "low" | "medium" | "high" } : null,
                  )
                }
                className="col-span-3"
              >
                <SelectTrigger>
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
                type="number"
                id="estimatedHours"
                value={editingWeeklyTask?.estimatedHours || 0}
                onChange={(e) =>
                  setEditingWeeklyTask((prev) =>
                    prev ? { ...prev, estimatedHours: Number.parseInt(e.target.value) } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditingWeeklyTask(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={saveEditedWeeklyTask}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingDailyTask !== null} onOpenChange={() => setEditingDailyTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Daily Task</DialogTitle>
            <DialogDescription>Edit an existing daily task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                value={editingDailyTask?.title || ""}
                onChange={(e) => setEditingDailyTask((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editingDailyTask?.description || ""}
                onChange={(e) =>
                  setEditingDailyTask((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={editingDailyTask?.category || ""}
                onValueChange={(value) => setEditingDailyTask((prev) => (prev ? { ...prev, category: value } : null))}
                className="col-span-3"
              >
                <SelectTrigger>
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
                value={editingDailyTask?.goalId || ""}
                onValueChange={(value) => setEditingDailyTask((prev) => (prev ? { ...prev, goalId: value } : null))}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  {goalsData[editingDailyTask?.category || ""]?.map((goal) => (
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
                type="text"
                id="timeBlock"
                value={editingDailyTask?.timeBlock || ""}
                onChange={(e) => setEditingDailyTask((prev) => (prev ? { ...prev, timeBlock: e.target.value } : null))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimatedMinutes" className="text-right">
                Estimated Minutes
              </Label>
              <Input
                type="number"
                id="estimatedMinutes"
                value={editingDailyTask?.estimatedMinutes || 0}
                onChange={(e) =>
                  setEditingDailyTask((prev) =>
                    prev ? { ...prev, estimatedMinutes: Number.parseInt(e.target.value) } : null,
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditingDailyTask(null)}>
              Cancel
            </Button>
            <Button type="submit" onClick={saveEditedDailyTask}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GoalTrackerApp

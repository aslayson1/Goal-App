"use client"
import { supabase } from "@/lib/supabase/client"

import { useState, useEffect } from "react"
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
  ClipboardCheck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

// Auth components
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { AuthScreen } from "@/components/auth/auth-screen"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Drag and Drop imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
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
          { id: "m3", title: "Complete second Half Ironman", completed: false, targetDate: "2027-04-15" },
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
      estimatedHours: 120,
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
  const { user, isLoading } = useAuth()
  const [goalsData, setGoalsData] = useState<GoalsData>(initialGoalsData)
  console.log("[v0] GoalTrackerApp render - goalsData keys:", Object.keys(goalsData))
  // The lint error was here: longTermGoals was used before it was declared.
  // It has been moved down to be declared before its first use.
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoalsData>(initialLongTermGoals)
  console.log("[v0] GoalTrackerApp render - longTermGoals 1-year keys:", Object.keys(longTermGoals["1-year"]))
  console.log("[v0] GoalTrackerApp render - longTermGoals 5-year keys:", Object.keys(longTermGoals["5-year"]))
  const [weeklyTasks, setWeeklyTasks] = useState<Record<string, WeeklyTask[]>>({})
  const [dailyTasks, setDailyTasks] = useState<Record<string, DailyTask[]>>({})
  console.log("[v0] GoalTrackerApp render - weeklyTasks keys:", Object.keys(weeklyTasks))
  console.log("[v0] GoalTrackerApp render - dailyTasks keys:", Object.keys(dailyTasks))

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [activeView, setActiveView] = useState("daily")
  const [currentPage, setCurrentPage] = useState("dashboard")

  const [currentWeek, setCurrentWeek] = useState(() => {
    // Get or set the 12-week start date
    const startDateKey = `goalTracker_startDate_${user?.id || "default"}`
    let startDate = localStorage.getItem(startDateKey)

    if (!startDate) {
      // First time user - set start date to today
      startDate = new Date().toISOString()
      localStorage.setItem(startDateKey, startDate)
    }

    // Calculate current week based on start date
    const start = new Date(startDate)
    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const weekNumber = Math.floor(daysDiff / 7) + 1

    // Ensure week is between 1 and 12
    return Math.min(Math.max(weekNumber, 1), 12)
  })
  const [selectedDay, setSelectedDay] = useState(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = new Date().getDay()
    return days[today]
  })

  // Add state for long-term goals:
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
  // CHANGE START
  const [agents, setAgents] = useState<
    Array<{
      id: string
      name: string
      role: string
      description: string
    }>
  >([])
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [editingAgent, setEditingAgent] = useState<{
    id: string
    name: string
    role: string
    description: string
  } | null>(null)
  const [newAgent, setNewAgent] = useState({
    name: "",
    role: "",
    description: "",
  })
  // CHANGE END

  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  const [editingGoal, setEditingGoal] = useState<{ category: string; goal: Goal } | null>(null)
  const [showDeleteGoal, setShowDeleteGoal] = useState<{ category: string; goalId: string; title: string } | null>(null)
  const [showDeleteCategory, setShowDeleteCategory] = useState<string | null>(null)

  const [editingWeeklyTask, setEditingWeeklyTask] = useState<WeeklyTask | null>(null)
  const [editingDailyTask, setEditingDailyTask] = useState<DailyTask | null>(null)
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
    return "bg-black text-white border-black"

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
    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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

  // Load data on mount
  useEffect(() => {
    if (user?.id) {
      loadCategoriesAndGoalsFromDB(user.id).then(setGoalsData)
      loadTasksFromDB(user.id).then((data) => {
        setDailyTasks(data.dailyTasks)
        setWeeklyTasks(data.weeklyTasks)
      })
      loadLongTermGoalsFromDB()
      loadAgents() // Load agents on mount
    }
  }, [user?.id]) // Re-fetch if user ID changes

  // Load data on mount
  useEffect(() => {
    if (user?.id) {
      // This is a placeholder. Replace with actual data loading functions.
      const loadGoals = async () => {
        console.log("Loading goals...")
        // Replace with actual logic to fetch goals from Supabase
        // For now, we'll stick with the initialGoalsData and rely on subsequent fetches.
      }
      const loadWeeklyTasks = async () => {
        console.log("Loading weekly tasks...")
        // Replace with actual logic to fetch weekly tasks
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .eq("task_type", "weekly")
          .limit(10) // Limit for initial load

        if (error) console.error("Error loading weekly tasks:", error)
        // Process data and update weeklyTasks state
      }
      const loadDailyTasks = async () => {
        console.log("Loading daily tasks...")
        // Replace with actual logic to fetch daily tasks
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .eq("task_type", "daily")
          .limit(10) // Limit for initial load

        if (error) console.error("Error loading daily tasks:", error)
        // Process data and update dailyTasks state
      }
      const loadLongTermGoals = async () => {
        console.log("Loading long-term goals...")
        // Replace with actual logic to fetch long-term goals
        const { data, error } = await supabase.from("long_term_goals").select("*").eq("user_id", user.id)

        if (error) console.error("Error loading long-term goals:", error)
        // Process data and update longTermGoals state
      }
      const loadCategories = async () => {
        console.log("Loading categories...")
        // Replace with actual logic to fetch categories
        const { data, error } = await supabase.from("categories").select("*").eq("user_id", user.id)

        if (error) console.error("Error loading categories:", error)
        // Process data and update goalsData state based on categories
      }
      const loadAgents = async () => {
        console.log("Loading agents...")
        try {
          const { data, error } = await supabase
            .from("agents")
            .select("*")
            .eq("user_id", user?.id)
            .order("created_at", { ascending: false })

          if (error) throw error
          setAgents(data || [])
        } catch (error) {
          console.error("Error loading agents:", error)
        }
      }

      loadGoals()
      loadWeeklyTasks()
      loadDailyTasks()
      loadLongTermGoals()
      loadCategories()
      loadAgents() // Load agents on mount
    }
  }, [user?.id]) // Re-fetch if user ID changes

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const incrementGoal = async (category: string, goalId: string, amount = 1) => {
    const goal = goalsData[category]?.find((g) => g.id === goalId)
    if (!goal) return

    const newCount = Math.min(goal.currentCount + amount, goal.targetCount)

    // Update local state immediately for UI feedback
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: newCount } : goal)),
    }))

    // Check if this is a database goal (has UUID format) vs local goal
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goalId)

    if (isUUID) {
      try {
        const { error } = await supabase.from("goals").update({ current_progress: newCount }).eq("id", goalId)

        if (error) {
          console.error("Error updating goal progress:", error)
          // Revert local state on error
          setGoalsData((prev) => ({
            ...prev,
            [category]: prev[category].map((goal) =>
              goal.id === goalId ? { ...goal, currentCount: goal.currentCount } : goal,
            ),
          }))
        }
      } catch (error) {
        console.error("Error updating goal progress:", error)
      }
    }
  }

  const updateGoalProgress = async (category: string, goalId: string, newValue: number) => {
    const goal = goalsData[category]?.find((g) => g.id === goalId)
    if (!goal) return

    const clampedValue = Math.min(Math.max(newValue, 0), goal.targetCount)

    // Update local state immediately for UI feedback
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: clampedValue } : goal)),
    }))

    // Check if this is a database goal (has UUID format) vs local goal
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goalId)

    if (isUUID) {
      try {
        const { error } = await supabase.from("goals").update({ current_progress: clampedValue }).eq("id", goalId)

        if (error) {
          console.error("Error updating goal progress:", error)
          // Revert local state on error
          setGoalsData((prev) => ({
            ...prev,
            [category]: prev[category].map((goal) =>
              goal.id === goalId ? { ...goal, currentCount: goal.currentCount } : goal,
            ),
          }))
        }
      } catch (error) {
        console.error("Error updating goal progress:", error)
      }
    }
  }

  const toggleBinaryGoal = async (category: string, goalId: string) => {
    const goal = goalsData[category]?.find((g) => g.id === goalId)
    if (!goal) return

    const newCurrentCount = goal.currentCount === 0 ? goal.targetCount : 0

    try {
      const { error } = await supabase
        .from("goals")
        .update({
          current_progress: newCurrentCount,
          completed: newCurrentCount >= goal.targetCount,
        })
        .eq("id", goalId)

      if (error) throw error

      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) =>
          goal.id === goalId ? { ...goal, currentCount: newCurrentCount } : goal,
        ),
      }))
    } catch (error) {
      console.error("Error updating binary goal:", error)
    }
  }

  const toggleGoalCompletion = async (goalId: string, category: string) => {
    console.log("[v0] toggleGoalCompletion called", { goalId, category })

    // Check if this is a local goal (non-UUID) or database goal (UUID format)
    const isLocalGoal = !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goalId)
    console.log("[v0] isLocalGoal:", isLocalGoal)

    if (isLocalGoal) {
      // Handle local goals - just update local state
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) =>
          goal.id === goalId
            ? { ...goal, currentCount: goal.currentCount >= goal.targetCount ? 0 : goal.targetCount }
            : goal,
        ),
      }))
      return
    }

    // Handle database goals - update both local state and database
    try {
      const goal = goalsData[category]?.find((g) => g.id === goalId)
      console.log("[v0] Found goal:", goal)
      if (!goal) return

      const newProgress = goal.currentCount >= goal.targetCount ? 0 : goal.targetCount
      const isCompleted = newProgress >= goal.targetCount
      console.log("[v0] Goal completion logic:", {
        currentCount: goal.currentCount,
        targetCount: goal.targetCount,
        newProgress,
        isCompleted,
      })

      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: newProgress } : goal)),
      }))

      console.log("[v0] Updating database with:", {
        current_progress: newProgress,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })

      const { error } = await supabase
        .from("goals")
        .update({
          current_progress: newProgress,
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", goalId)

      if (error) {
        console.error("[v0] Error updating goal completion:", error.message)
        setGoalsData((prev) => ({
          ...prev,
          [category]: prev[category].map((goal) =>
            goal.id === goalId
              ? { ...goal, currentCount: goal.currentCount >= goal.targetCount ? goal.targetCount : 0 }
              : goal,
          ),
        }))
        return
      }

      console.log("[v0] Database update successful")
    } catch (error) {
      console.error("[v0] Error updating goal completion:", error)
    }
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

  const addNewGoal = async () => {
    const detectedNumber = extractNumberFromTitle(newGoal.title)
    const targetCount = detectedNumber > 0 ? newGoal.targetCount || detectedNumber : 1

    if (!selectedCategory || !newGoal.title) return

    const goalId = crypto.randomUUID()

    const weeklyTargetValue = newGoal.weeklyTarget || Math.ceil(targetCount / 12)

    // Update local state first (preserve existing UI behavior)
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
          weeklyTarget: weeklyTargetValue,
          category: selectedCategory,
        },
      ],
    }))

    try {
      if (!user?.id) {
        console.error("User not authenticated")
        return
      }

      // Find the category ID from the database
      const { data: categories } = await supabase
        .from("categories")
        .select("id")
        .eq("name", selectedCategory)
        .eq("user_id", user.id)
        .single()

      if (!categories) {
        console.error("Category not found in database")
        return
      }

      const { error } = await supabase.from("goals").insert({
        id: goalId,
        user_id: user.id,
        category_id: categories.id,
        title: newGoal.title,
        description: newGoal.description,
        target_count: targetCount,
        current_progress: 0,
        weekly_target: weeklyTargetValue,
      })

      if (error) {
        console.error("Error saving goal to database:", error)
      } else {
        console.log("Goal saved to database successfully")
      }
    } catch (error) {
      console.error("Error saving goal:", error)
    }

    setNewGoal({ title: "", description: "", targetCount: 0, weeklyTarget: 0 })
    setSelectedCategory("")
    setShowAddGoal(false)
  }

  const addNewCategory = async () => {
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

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: categoryName,
          user_id: user?.id || null,
          color: "#3b82f6", // Default blue color
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving category:", error)
        alert(`Failed to save category: ${error.message}`)
        return
      }

      // Update local state
      setGoalsData((prev) => ({
        ...prev,
        [categoryName]: [],
      }))

      setNewCategoryName("")
      setShowAddCategory(false)
      console.log("Category saved successfully:", categoryName)
    } catch (error) {
      console.error("Error adding category:", error)
      alert("Failed to add category. Please try again.")
    }
  }

  const editGoal = (category: string, goalId: string, updatedGoal: Partial<Goal>) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, ...updatedGoal } : goal)),
    }))
  }

  const deleteGoal = async (category: string, goalId: string) => {
    try {
      await supabase.from("goals").delete().eq("id", goalId)
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].filter((goal) => goal.id !== goalId),
      }))
      setShowDeleteGoal(null)
    } catch (error) {
      console.error("Error deleting goal:", error)
      // Keep the goal in UI if database deletion fails
    }
  }

  const updateGoal = async () => {
    if (!editingGoal) return

    const weeklyTargetValue = newGoal.weeklyTarget || Math.ceil(newGoal.targetCount / 12)

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(editingGoal.goal.id)

    if (isUUID) {
      try {
        const { error } = await supabase
          .from("goals")
          .update({
            title: newGoal.title,
            description: newGoal.description,
            target_count: newGoal.targetCount,
            weekly_target: weeklyTargetValue,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingGoal.goal.id)

        if (error) throw error
      } catch (error) {
        console.error("Error updating goal in database:", error)
        // Continue with local update even if database fails
      }
    }

    editGoal(editingGoal.category, editingGoal.goal.id, {
      title: newGoal.title,
      description: newGoal.description,
      targetCount: newGoal.targetCount,
      weeklyTarget: weeklyTargetValue,
    })

    setNewGoal({ title: "", description: "", targetCount: 0, weeklyTarget: 0 })
    setEditingGoal(null)
  }

  const saveEditedGoal = () => {
    if (!editingGoal) return

    updateGoal()
    setEditingGoal(null)
    setShowAddGoal(false)
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

  const editWeeklyTask = async (taskId: string, updatedTask: Partial<WeeklyTask>) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          // Remove category, priority, estimated_hours as they don't exist in database schema
        })
        .eq("id", taskId)

      if (error) {
        console.error("Database error updating weekly task:", error)
        return
      }

      // Update local state only if database update succeeds
      setWeeklyTasks((prev) => ({
        ...prev,
        [`Week ${currentWeek}`]:
          prev[`Week ${currentWeek}`]?.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)) || [],
      }))
    } catch (error) {
      console.error("Error updating weekly task:", error)
      // Don't update local state if database update fails
    }
  }

  const deleteDailyTask = async (day: string, taskId: string) => {
    try {
      await supabase.from("tasks").delete().eq("id", taskId)

      setDailyTasks((prev) => ({
        ...prev,
        [day]: prev[day]?.filter((task) => task.id !== taskId) || [],
      }))
    } catch (error) {
      console.error("Error deleting daily task:", error)
      // Keep the task in UI if database deletion fails
    }
  }

  const editDailyTask = (day: string, taskId: string, updatedTask: Partial<DailyTask>) => {
    setDailyTasks((prev) => ({
      ...prev,
      [day]: prev[day]?.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)) || [],
    }))
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

  const startEditingGoal = (category: string, goal: Goal) => {
    setEditingGoal({ category, goal })
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetCount: goal.targetCount,
      weeklyTarget: goal.weeklyTarget,
    })
    setShowAddGoal(true)
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
      priority: "medium" as const,
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

  const startEditingCategory = (category: string) => {
    setShowEditCategory(category)
    setEditCategoryName(category)
    setEditCategoryColor(customCategoryColors[category] || getCategoryColor(category))
  }

  const saveEditedCategory = async () => {
    if (!showEditCategory || !editCategoryName.trim()) return

    const oldCategoryName = showEditCategory
    const newCategoryName = editCategoryName.trim()

    try {
      const { data: categories, error: fetchError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", oldCategoryName)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)

      if (fetchError) {
        console.error("Error finding category:", fetchError)
        return
      }

      if (categories) {
        const { error: updateError } = await supabase
          .from("categories")
          .update({
            name: newCategoryName,
            color: editCategoryColor,
            updated_at: new Date().toISOString(),
          })
          .eq("id", categories.id)

        if (updateError) {
          console.error("Database error updating category:", updateError)
          return
        }
      }

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

        // Update custom colors
        setCustomCategoryColors((prev) => {
          const updated = { ...prev }
          if (updated[oldCategoryName]) {
            updated[newCategoryName] = updated[oldCategoryName]
            delete updated[oldCategoryName]
          }
          return updated
        })
      }

      // Update color
      setCustomCategoryColors((prev) => ({
        ...prev,
        [newCategoryName]: editCategoryColor,
      }))

      setShowEditCategory(null)
      setEditCategoryName("")
      setEditCategoryColor("")
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  const deleteCategory = async (category: string) => {
    try {
      // Find the category ID from the categories data
      const { data: categories } = await supabase
        .from("categories")
        .select("id")
        .eq("name", category)
        .eq("user_id", user?.id)
        .single()

      if (categories) {
        // Delete from database first
        const { error } = await supabase.from("categories").delete().eq("id", categories.id)
        if (error) throw error
      }

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

      setShowDeleteCategory(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      // Optionally show error message to user
    }
  }

  const loadCategoriesAndGoalsFromDB = async (userId: string) => {
    try {
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
        return initialGoalsData
      }

      const { data: goals, error: goalsError } = await supabase
        .from("goals")
        .select(
          `
        *,
        categories (
          name
        )
      `,
        )
        .eq("user_id", userId)

      if (goalsError) {
        console.error("Error fetching goals:", goalsError)
        return initialGoalsData
      }

      // Group goals by category
      const groupedGoals: GoalsData = {}

      // Initialize with categories
      categories.forEach((category) => {
        groupedGoals[category.name] = []
      })

      // Add goals to their categories
      goals.forEach((goal) => {
        const categoryName = goal.categories?.name || "Uncategorized"
        if (!groupedGoals[categoryName]) {
          groupedGoals[categoryName] = []
        }

        groupedGoals[categoryName].push({
          id: goal.id,
          title: goal.title,
          description: goal.description || "",
          targetCount: goal.target_count || 1,
          currentCount: goal.current_progress || 0,
          notes: goal.notes || "",
          weeklyTarget: goal.weekly_target || 1,
          category: categoryName,
        })
      })

      if (Object.keys(groupedGoals).length === 0) {
        console.log("[v0] No categories found in database, using initial data")
        return initialGoalsData
      }

      return groupedGoals
    } catch (error) {
      console.error("Error loading data from database:", error)
      return initialGoalsData
    }
  }

  // Add these functions after the existing helper functions (around line 1200):
  const startEditingLongTermGoal = (timeframe: "1-year" | "5-year", category: string, goal: LongTermGoal) => {
    setEditingLongTermGoal({ timeframe, category, goal })
    setSelectedTimeframe(timeframe)
    setNewLongTermGoal({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      category: goal.category,
      notes: goal.notes,
      milestones: goal.milestones.map((m) => ({
        title: m.title,
        targetDate: m.targetDate,
      })),
    })
  }

  const saveEditedLongTermGoal = () => {
    if (!editingLongTermGoal) return

    const { timeframe, category, goal } = editingLongTermGoal

    setLongTermGoals((prev) => ({
      ...prev,
      [timeframe]: {
        ...prev[timeframe],
        [category]: prev[timeframe][category].map((g) =>
          g.id === goal.id
            ? {
                ...g,
                title: newLongTermGoal.title,
                description: newLongTermGoal.description,
                targetDate: newLongTermGoal.targetDate,
                category: newLongTermGoal.category,
                notes: newLongTermGoal.notes,
                milestones: newLongTermGoal.milestones
                  .filter((m) => m.title && m.targetDate)
                  .map((m, index) => ({
                    id: `${g.id}_m${index + 1}`,
                    title: m.title,
                    completed: g.milestones[index]?.completed || false,
                    targetDate: m.targetDate,
                  })),
              }
            : g,
        ),
      },
    }))

    setNewLongTermGoal({
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
    setEditingLongTermGoal(null)
    setShowAddLongTermGoal(false)
  }

  const addLongTermGoal = async () => {
    if (!newLongTermGoal.title || !user?.id) return

    try {
      const goalType = selectedTimeframe === "1-year" ? "1_year" : "5_year"

      // Save to database
      const { data, error } = await supabase
        .from("long_term_goals")
        .insert([
          {
            user_id: user.id,
            title: newLongTermGoal.title,
            description: newLongTermGoal.description,
            goal_type: goalType, // Use converted goal_type value
            completed: false,
          },
        ])
        .select()

      if (error) throw error

      // Update local state
      if (data && data[0]) {
        const newGoal = {
          id: data[0].id,
          title: newLongTermGoal.title,
          description: newLongTermGoal.description,
          targetDate: newLongTermGoal.targetDate,
          category: newLongTermGoal.category,
          status: "in-progress" as const,
          notes: newLongTermGoal.notes,
          milestones: newLongTermGoal.milestones
            .filter((m) => m.title && m.targetDate)
            .map((m, index) => ({
              id: `${data[0].id}_m${index + 1}`,
              title: m.title,
              completed: false,
              targetDate: m.targetDate,
            })),
        }

        setLongTermGoals((prev) => ({
          ...prev,
          [selectedTimeframe]: {
            ...prev[selectedTimeframe],
            [newLongTermGoal.category]: [...(prev[selectedTimeframe][newLongTermGoal.category] || []), newGoal],
          },
        }))
      }

      // Reset form and close dialog
      setNewLongTermGoal({
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
      setShowAddLongTermGoal(false)
    } catch (error) {
      console.error("Error adding long-term goal:", error)
    }
  }

  const deleteLongTermGoal = (timeframe: "1-year" | "5-year", category: string, goalId: string) => {
    setLongTermGoals((prev) => ({
      ...prev,
      [timeframe]: {
        ...prev[timeframe],
        [category]: prev[timeframe][category].filter((g) => g.id !== goalId),
      },
    }))
    setShowDeleteLongTermGoal(null)
  }

  const getTotalProgress = () => {
    // This prevents goals with large targets from skewing the overall progress
    console.log("[v0] getTotalProgress called")
    const goalPercentages: number[] = []

    // Calculate progress for 12-week goals (numerical goals)
    Object.values(goalsData).forEach((goals) => {
      goals.forEach((goal) => {
        const percentage = goal.targetCount === 0 ? 0 : (goal.currentCount / goal.targetCount) * 100
        goalPercentages.push(percentage)
        console.log("[v0] Processing 12-week goal:", {
          title: goal.title,
          currentCount: goal.currentCount,
          targetCount: goal.targetCount,
          percentage: percentage.toFixed(2) + "%",
        })
      })
    })

    console.log("[v0] After 12-week goals, total goals:", goalPercentages.length)

    // Calculate progress for long-term goals (1-year and 5-year)
    // These use milestones to track progress
    Object.values(longTermGoals).forEach((timeframeGoals) => {
      Object.values(timeframeGoals).forEach((goals) => {
        goals.forEach((goal) => {
          if (goal.status === "completed") {
            // Completed goals count as 100%
            goalPercentages.push(100)
            console.log("[v0] Long-term goal completed:", goal.title)
          } else if (goal.milestones && goal.milestones.length > 0) {
            // Calculate progress based on completed milestones
            const completedMilestones = goal.milestones.filter((m) => m.completed).length
            const percentage = (completedMilestones / goal.milestones.length) * 100
            goalPercentages.push(percentage)
            console.log("[v0] Long-term goal with milestones:", {
              title: goal.title,
              completedMilestones,
              totalMilestones: goal.milestones.length,
              percentage: percentage.toFixed(2) + "%",
            })
          } else {
            // Goals without milestones count as 0% (incomplete)
            goalPercentages.push(0)
            console.log("[v0] Long-term goal without milestones:", goal.title)
          }
        })
      })
    })

    // Calculate average of all goal percentages
    const totalPercentage = goalPercentages.reduce((sum, p) => sum + p, 0)
    const averagePercentage = goalPercentages.length === 0 ? 0 : totalPercentage / goalPercentages.length
    const finalPercentage = Math.round(averagePercentage)

    console.log("[v0] Final progress calculation:", {
      totalGoals: goalPercentages.length,
      averagePercentage: averagePercentage.toFixed(2) + "%",
      finalPercentage: finalPercentage + "%",
    })

    return finalPercentage
  }

  const getTotalTasks = () => {
    let totalTasks = 0
    Object.values(weeklyTasks).forEach((tasks) => {
      totalTasks += tasks.length
    })
    Object.values(dailyTasks).forEach((tasks) => {
      totalTasks += tasks.length
    })
    return totalTasks
  }

  const getCompletedTasks = () => {
    let completedTasks = 0
    Object.values(weeklyTasks).forEach((tasks) => {
      tasks.forEach((task) => {
        if (task.completed) {
          completedTasks++
        }
      })
    })
    Object.values(dailyTasks).forEach((tasks) => {
      tasks.forEach((task) => {
        if (task.completed) {
          completedTasks++
        }
      })
    })
    return completedTasks
  }

  const getTotalGoals = () => {
    let totalGoals = 0
    Object.values(goalsData).forEach((goals) => {
      totalGoals += goals.length
    })
    // Add long-term goals to the total count
    Object.values(longTermGoals).forEach((timeframeGoals) => {
      Object.values(timeframeGoals).forEach((goals) => {
        totalGoals += goals.length
      })
    })
    return totalGoals
  }

  const getCompletedGoals = () => {
    let completedGoals = 0
    Object.values(goalsData).forEach((goals) => {
      goals.forEach((goal) => {
        if (goal.currentCount >= goal.targetCount) {
          completedGoals++
        }
      })
    })
    // Count completed long-term goals
    Object.values(longTermGoals).forEach((timeframeGoals) => {
      Object.values(timeframeGoals).forEach((goals) => {
        goals.forEach((goal) => {
          if (goal.status === "completed") {
            completedGoals++
          }
        })
      })
    })
    return completedGoals
  }

  const getProgressPercentage = (current: number, target: number) => {
    return target === 0 ? 0 : (current / target) * 100
  }

  const getWeeklyProgress = (goal: Goal) => {
    const weeklyTarget = goal.weeklyTarget || Math.ceil(goal.targetCount / 12)
    const expectedProgress = weeklyTarget * currentWeek
    const onTrack = goal.currentCount >= expectedProgress
    return { weeklyTarget, expectedProgress, onTrack }
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

  const updateNotes = (category: string, goalId: string, notes: string) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, notes } : goal)),
    }))
  }

  const handleWeeklyTaskDragEnd = (event: DragEndEvent, category: string) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      setWeeklyTasks((prev) => {
        const oldIndex = prev[`Week ${currentWeek}`]?.findIndex((task) => task.id === active.id) || -1
        const newIndex = prev[`Week ${currentWeek}`]?.findIndex((task) => task.id === over.id) || -1

        if (oldIndex === -1 || newIndex === -1) return prev

        const newItems = arrayMove(prev[`Week ${currentWeek}`], oldIndex, newIndex)

        return {
          ...prev,
          [`Week ${currentWeek}`]: newItems,
        }
      })
    }
  }

  const toggleWeeklyTask = async (weekKey: string, taskId: string) => {
    // Find the current task to get its completion status
    const currentTask = weeklyTasks[weekKey]?.find((task) => task.id === taskId)
    if (!currentTask) return

    const newCompletedStatus = !currentTask.completed

    // Update local state immediately for UI feedback
    setWeeklyTasks((prev) => ({
      ...prev,
      [weekKey]:
        prev[weekKey]?.map((task) => (task.id === taskId ? { ...task, completed: newCompletedStatus } : task)) || [],
    }))

    // Update database
    try {
      const { error } = await supabase.from("tasks").update({ completed: newCompletedStatus }).eq("id", taskId)

      if (error) {
        console.error("Error updating task completion:", error)
        // Revert local state on error
        setWeeklyTasks((prev) => ({
          ...prev,
          [weekKey]:
            prev[weekKey]?.map((task) => (task.id === taskId ? { ...task, completed: currentTask.completed } : task)) ||
            [],
        }))
      }
    } catch (error) {
      console.error("Error updating task completion:", error)
    }
  }

  const handleDailyTaskDragEnd = (event: DragEndEvent, category: string) => {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      setDailyTasks((prev) => {
        const oldIndex = prev[selectedDay]?.findIndex((task) => task.id === active.id) || -1
        const newIndex = prev[selectedDay]?.findIndex((task) => task.id === over.id) || -1

        if (oldIndex === -1 || newIndex === -1) return prev

        const newItems = arrayMove(prev[selectedDay], oldIndex, newIndex)

        return {
          ...prev,
          [selectedDay]: newItems,
        }
      })
    }
  }

  const toggleDailyTask = async (selectedDay: string, taskId: string) => {
    // Find the current task to get its completion status
    const currentTask = dailyTasks[selectedDay]?.find((task) => task.id === taskId)
    if (!currentTask) return

    const newCompletedStatus = !currentTask.completed

    // Update local state immediately for UI feedback
    setDailyTasks((prev) => ({
      ...prev,
      [selectedDay]:
        prev[selectedDay]?.map((task) => (task.id === taskId ? { ...task, completed: newCompletedStatus } : task)) ||
        [],
    }))

    // Update database
    try {
      const { error } = await supabase.from("tasks").update({ completed: newCompletedStatus }).eq("id", taskId)

      if (error) {
        console.error("Error updating task completion:", error)
        // Revert local state on error
        setDailyTasks((prev) => ({
          ...prev,
          [selectedDay]:
            prev[selectedDay]?.map((task) =>
              task.id === taskId ? { ...task, completed: currentTask.completed } : task,
            ) || [],
        }))
      }
    } catch (error) {
      console.error("Error updating task completion:", error)
    }
  }

  const addDailyTask = async () => {
    if (!newDailyTask.title) {
      return
    }

    const taskId = crypto.randomUUID()

    const taskData = {
      title: newDailyTask.title,
      description: newDailyTask.description,
      category: newDailyTask.category,
      goalId: newDailyTask.goalId,
    }

    // Update local state immediately
    setDailyTasks((prev) => ({
      ...prev,
      [selectedDay]: [
        ...(prev[selectedDay] || []),
        {
          id: taskId,
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          goalId: taskData.goalId,
          completed: false,
        },
      ],
    }))

    setNewDailyTask({
      title: "",
      description: "",
      category: "",
      goalId: "",
      timeBlock: "",
      estimatedMinutes: 30,
    })
    setShowAddDailyTask(false)

    try {
      if (!user?.id) {
        console.error("No user ID available")
        return
      }

      // Look up category ID if category is provided
      let categoryId = null
      if (taskData.category) {
        const { data: categories } = await supabase
          .from("categories")
          .select("id")
          .eq("name", taskData.category)
          .eq("user_id", user.id)
          .single()

        categoryId = categories?.id || null
      }

      // Calculate the target_date based on the selected day
      const today = new Date()
      const currentDayIndex = today.getDay()
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const selectedDayIndex = daysOfWeek.indexOf(selectedDay)

      // Calculate days difference
      let daysDiff = selectedDayIndex - currentDayIndex

      // If the selected day is in the past this week, move to next week
      if (daysDiff < 0) {
        daysDiff += 7
      }

      // Create target date
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + daysDiff)

      const insertData = {
        id: taskId,
        user_id: user.id,
        category_id: categoryId,
        goal_id: taskData.goalId || null,
        title: taskData.title,
        description: taskData.description,
        task_type: "daily",
        target_date: targetDate.toISOString().split("T")[0],
        completed: false,
      }

      const { error } = await supabase.from("tasks").insert(insertData).select()

      if (error) {
        console.error("Error saving daily task:", error)
      }
    } catch (err) {
      console.error("Exception during database operation:", err)
    }
  }

  const addWeeklyTask = async () => {
    if (!newWeeklyTask.title || !newWeeklyTask.category) return

    const taskId = crypto.randomUUID()

    setWeeklyTasks((prev) => ({
      ...prev,
      [`Week ${currentWeek}`]: [
        ...(prev[`Week ${currentWeek}`] || []),
        {
          id: taskId,
          title: newWeeklyTask.title,
          description: newWeeklyTask.description,
          category: newWeeklyTask.category,
          goalId: newWeeklyTask.goalId,
          completed: false,
        },
      ],
    }))

    try {
      if (!user?.id) {
        console.error("User not authenticated")
        return
      }

      // Find category ID from database
      const { data: categories } = await supabase
        .from("categories")
        .select("id")
        .eq("name", newWeeklyTask.category)
        .eq("user_id", user.id)
        .single()

      const { error } = await supabase.from("tasks").insert({
        id: taskId,
        user_id: user.id,
        category_id: categories?.id || null,
        goal_id: newWeeklyTask.goalId || null,
        title: newWeeklyTask.title,
        description: newWeeklyTask.description,
        task_type: "weekly",
        target_date: new Date().toISOString().split("T")[0],
        completed: false,
      })

      if (error) {
        console.error("Error saving weekly task to database:", error.message)
      } else {
        console.log("Weekly task saved to database successfully")
      }
    } catch (error) {
      console.error("Error saving weekly task to database:", error)
    }

    setNewWeeklyTask({
      title: "",
      description: "",
      category: "",
      goalId: "",
      priority: "medium" as const,
      estimatedHours: 1,
    })
    setShowAddWeeklyTask(false)
  }

  async function loadTasksFromDB(userId: string) {
    try {
      console.log("=== LOADING TASKS FROM DATABASE ===")
      console.log("Fetching tasks for user ID:", userId)

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select(
          `
        *,
        categories (
          name
        )
      `,
        )
        .eq("user_id", userId)

      if (tasksError) {
        console.error("Error fetching tasks:", tasksError)
        return { weeklyTasks: {}, dailyTasks: {} }
      }

      console.log("Raw tasks from database:", JSON.stringify(tasks, null, 2))
      console.log("Number of tasks found:", tasks?.length || 0)

      const completedTasks = tasks?.filter((t) => t.completed) || []
      const incompleteTasks = tasks?.filter((t) => !t.completed) || []
      console.log("[v0] Total tasks:", tasks?.length || 0)
      console.log("[v0] Completed tasks:", completedTasks.length)
      console.log("[v0] Incomplete tasks:", incompleteTasks.length)
      console.log("[v0] Completed task details:", JSON.stringify(completedTasks, null, 2))

      const buyCarTask = tasks?.find((t) => t.title?.includes("Buy Car1"))
      if (buyCarTask) {
        console.log("[v0] FOUND 'Buy Car1' task:")
        console.log("[v0]   - ID:", buyCarTask.id)
        console.log("[v0]   - Title:", buyCarTask.title)
        console.log("[v0]   - Task Type:", buyCarTask.task_type)
        console.log("[v0]   - Completed:", buyCarTask.completed)
        console.log("[v0]   - Target Date:", buyCarTask.target_date)
        console.log("[v0]   - Category:", buyCarTask.categories?.name || "Uncategorized")
      } else {
        console.log("[v0] 'Buy Car1' task NOT FOUND in database results")
      }

      const weeklyTasks: Record<string, WeeklyTask[]> = {}
      const dailyTasks: Record<string, DailyTask[]> = {}

      tasks.forEach((task, index) => {
        console.log(`Processing task ${index + 1}:`, JSON.stringify(task, null, 2))

        const categoryName = task.categories?.name || "Uncategorized"

        if (task.task_type === "weekly") {
          const taskDate = new Date(task.target_date)
          const weekKey = `Week ${currentWeek}` // For now, only load current week's tasks

          console.log(`Adding weekly task to ${weekKey}`)
          console.log(
            `[v0] Weekly task "${task.title}" - completed: ${task.completed}, target_date: ${task.target_date}, assigned to: ${weekKey}`,
          )

          const weeklyTask: WeeklyTask = {
            id: task.id,
            title: task.title || "",
            description: task.description || "",
            category: categoryName,
            goalId: task.goal_id || "",
            completed: !!task.completed,
            priority: "medium",
            estimatedHours: 1,
          }

          if (!weeklyTasks[weekKey]) {
            weeklyTasks[weekKey] = []
          }
          weeklyTasks[weekKey].push(weeklyTask)
        } else if (task.task_type === "daily") {
          const taskDate = new Date(task.target_date)
          const day = taskDate.toLocaleDateString("en-US", { weekday: "long" })

          console.log(`Adding daily task to ${day} (target_date: ${task.target_date})`)
          console.log(
            `[v0] Daily task "${task.title}" - completed: ${task.completed}, target_date: ${task.target_date}, assigned to: ${day}`,
          )

          if (task.title?.includes("Buy Car1")) {
            console.log("[v0] PROCESSING 'Buy Car1' as daily task:")
            console.log("[v0]   - Will be added to day:", day)
            console.log("[v0]   - Completed value:", !!task.completed)
          }

          const dailyTask: DailyTask = {
            id: task.id,
            title: task.title || "",
            description: task.description || "",
            category: categoryName,
            goalId: task.goal_id || "",
            completed: !!task.completed,
            timeBlock: "9:00 AM",
            estimatedMinutes: 30,
          }

          if (!dailyTasks[day]) {
            dailyTasks[day] = []
          }
          dailyTasks[day].push(dailyTask)
        }
      })

      console.log("=== FINAL ORGANIZED TASKS ===")
      console.log("Organized daily tasks:", JSON.stringify(dailyTasks, null, 2))
      console.log("Organized weekly tasks:", JSON.stringify(weeklyTasks, null, 2))
      console.log("[v0] Final weekly tasks count:", Object.values(weeklyTasks).flat().length)
      console.log("[v0] Final daily tasks count:", Object.values(dailyTasks).flat().length)

      const allDailyTasksFlat = Object.values(dailyTasks).flat()
      const buyCarInFinal = allDailyTasksFlat.find((t) => t.title?.includes("Buy Car1"))
      if (buyCarInFinal) {
        console.log("[v0] 'Buy Car1' IS in final dailyTasks object")
        console.log("[v0]   - Completed:", buyCarInFinal.completed)
      } else {
        console.log("[v0] 'Buy Car1' is NOT in final dailyTasks object")
      }

      return { weeklyTasks, dailyTasks }
    } catch (error) {
      console.error("Error in loadTasksFromDB:", error)
      return { weeklyTasks: {}, dailyTasks: {} }
    }
  }

  const loadLongTermGoalsFromDB = async () => {
    if (!user?.id) return

    try {
      const { data: longTermGoalsData, error } = await supabase
        .from("long_term_goals")
        .select("*")
        .eq("user_id", user.id)

      if (error) throw error

      if (longTermGoalsData && longTermGoalsData.length > 0) {
        // Group goals by timeframe and category
        const groupedGoals: LongTermGoalsData = {
          "1-year": {},
          "5-year": {},
        }

        longTermGoalsData.forEach((goal) => {
          // Convert database goal_type format to display format
          const timeframe = goal.goal_type === "1_year" ? "1-year" : "5-year"
          const category = "Business" // Default category since database doesn't store categories

          if (!groupedGoals[timeframe][category]) {
            groupedGoals[timeframe][category] = []
          }

          groupedGoals[timeframe][category].push({
            id: goal.id,
            title: goal.title,
            description: goal.description || "",
            targetDate: "", // Database doesn't store target_date
            category: category,
            status: goal.completed ? "completed" : "in-progress",
            notes: "", // Database doesn't store notes
            milestones: [], // Database doesn't store milestones
          })
        })

        // Merge with initial data for categories that don't exist in database
        const mergedGoals: LongTermGoalsData = {
          "1-year": { ...initialLongTermGoals["1-year"], ...groupedGoals["1-year"] },
          "5-year": { ...initialLongTermGoals["5-year"], ...groupedGoals["5-year"] },
        }

        setLongTermGoals(mergedGoals)
      }
    } catch (error) {
      console.error("Error loading long-term goals:", error)
    }
  }

  const loadAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAgents(data || [])
    } catch (error) {
      console.error("Error loading agents:", error)
    }
  }

  const addAgent = async () => {
    // Remove debug logs and simplified validation
    if (!newAgent.name.trim() || !newAgent.role.trim()) {
      return
    }

    try {
      const { data, error } = await supabase
        .from("agents")
        .insert([
          {
            user_id: user?.id,
            name: newAgent.name,
            role: newAgent.role,
            description: newAgent.description,
          },
        ])
        .select()

      if (error) throw error

      if (data) {
        setAgents([...agents, data[0]])
        setNewAgent({ name: "", role: "", description: "" })
        setShowAddAgent(false)
      }
    } catch (error) {
      console.error("Error adding agent:", error)
    }
  }

  const updateAgent = async () => {
    if (!editingAgent || !editingAgent.name.trim() || !editingAgent.role.trim()) return

    try {
      const { error } = await supabase
        .from("agents")
        .update({
          name: editingAgent.name,
          role: editingAgent.role,
          description: editingAgent.description,
        })
        .eq("id", editingAgent.id)

      if (error) throw error

      setAgents(agents.map((a) => (a.id === editingAgent.id ? editingAgent : a)))
      setEditingAgent(null)
    } catch (error) {
      console.error("Error updating agent:", error)
    }
  }

  const deleteAgent = async (id: string) => {
    try {
      const { error } = await supabase.from("agents").delete().eq("id", id)

      if (error) throw error

      setAgents(agents.filter((a) => a.id !== id))
    } catch (error) {
      console.error("Error deleting agent:", error)
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/layson-group-logo.png"
              alt="Layson Group"
              width={180}
              height={40}
              className="h-10 w-auto object-contain"
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
              <DropdownMenuItem onClick={() => setShowProfile(true)}>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <SignOutButton className="w-full text-left" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          <SidebarInset className="flex-1">
            <main className="flex-1 overflow-auto p-6">
              <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Hi {user?.name?.split(" ")[0] || "there"},
                    </h1>
                    <p className="text-gray-600">Here are your tasks for week {currentWeek} of 12.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowAddGoal(true)}
                      className="text-sm bg-black hover:bg-gray-800 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddCategory(true)} className="text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                        <p className="text-4xl font-bold text-gray-900">{getTotalProgress()}%</p>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-2 text-[#05a7b0]" />
                          <p className="text-sm font-medium text-gray-600">Overall Goal Progress</p>
                        </div>
                        <div className="w-full">
                          <Progress value={getTotalProgress()} className="h-2 [&>div]:bg-[#05a7b0]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                        <p className="text-4xl font-bold text-gray-900">
                          {getCompletedTasks()}/{getTotalTasks()}
                        </p>
                        <div className="flex items-center">
                          <ClipboardCheck className="h-4 w-4 mr-2 text-[#05a7b0]" />
                          <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                        </div>
                        <div className="w-full">
                          <Progress
                            value={getTotalTasks() > 0 ? (getCompletedTasks() / getTotalTasks()) * 100 : 0}
                            className="h-2 [&>div]:bg-[#05a7b0]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                        <p className="text-4xl font-bold text-gray-900">
                          {getCompletedGoals()}/{getTotalGoals()}
                        </p>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-[#05a7b0]" />
                          <p className="text-sm font-medium text-gray-600">Goals Completed</p>
                        </div>
                        <div className="w-full">
                          <Progress
                            value={getTotalGoals() > 0 ? (getCompletedGoals() / getTotalGoals()) * 100 : 0}
                            className="h-2 [&>div]:bg-[#05a7b0]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                        <p className="text-4xl font-bold text-gray-900">{12 - currentWeek}</p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#05a7b0]" />
                          <p className="text-sm font-medium text-gray-600">Weeks Left</p>
                        </div>
                        <div className="w-full">
                          <Progress
                            value={((12 - (12 - currentWeek)) / 12) * 100}
                            className="h-2 [&>div]:bg-[#05a7b0]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* View Toggle */}
                <Tabs value={activeView} onValueChange={setActiveView} className="mb-8">
                  <TabsList className="grid w-full max-w-2xl grid-cols-3">
                    <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
                    <TabsTrigger value="12-week">12-Week Goals</TabsTrigger>
                  </TabsList>

                  {/* 12-Week Goals View */}
                  <TabsContent value="12-week" className="mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {Object.entries(goalsData).map(([category, goals]) => (
                        <Card
                          key={category}
                          className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <Badge
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                              >
                                {category}
                              </Badge>
                              <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setShowAddGoal(true)
                                      }}
                                    >
                                      <Target className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setNewWeeklyTask((prev) => ({ ...prev, category }))
                                        setShowAddWeeklyTask(true)
                                      }}
                                    >
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Add Weekly Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setNewDailyTask((prev) => ({ ...prev, category }))
                                        setShowAddDailyTask(true)
                                      }}
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Add Daily Task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setShowAddGoal(true)
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => startEditingCategory(category)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (goals.length === 0) {
                                          deleteCategory(category)
                                        }
                                      }}
                                      className={goals.length > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-600"}
                                      disabled={goals.length > 0}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {goals.length > 0 ? "Delete Category (remove goals first)" : "Delete Category"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <CardDescription className="mt-2">
                              {goals.length} goal{goals.length !== 1 ? "s" : ""} • Week {currentWeek}/12
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {goals.length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No goals in this category yet</p>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-sm bg-transparent">
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add First Item
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="center">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setShowAddGoal(true)
                                      }}
                                    >
                                      <Target className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setNewWeeklyTask((prev) => ({ ...prev, category }))
                                        setShowAddWeeklyTask(true)
                                      }}
                                    >
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Add Weekly Task
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setNewDailyTask((prev) => ({ ...prev, category }))
                                        setShowAddDailyTask(true)
                                      }}
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Add Daily Task
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ) : (
                              goals.map((goal) => {
                                const progressPercentage = getProgressPercentage(goal.currentCount, goal.targetCount)
                                const weeklyProgress = getWeeklyProgress(goal)
                                const isCompleted = goal.currentCount >= goal.targetCount
                                const goalType = getGoalType(goal.targetCount)
                                const quickIncrements = getQuickIncrements(goal.targetCount)

                                return (
                                  <div
                                    key={goal.id}
                                    className="p-3 rounded-lg bg-gray-50 border border-border space-y-3"
                                  >
                                    {/* All goals now have checkbox + title layout */}
                                    <div className="flex items-start space-x-3">
                                      <Checkbox
                                        checked={isCompleted}
                                        onCheckedChange={() => toggleGoalCompletion(goal.id, category)}
                                        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1 min-w-0">
                                            <h4
                                              className={`font-medium ${isCompleted ? "line-through text-gray-500" : "text-gray-900"} break-words`}
                                            >
                                              {goal.title}
                                            </h4>
                                            <p
                                              className={`text-sm mt-1 ${isCompleted ? "text-gray-400" : "text-gray-600"} break-words`}
                                            >
                                              {goal.description}
                                            </p>
                                          </div>
                                          <div className="flex items-center space-x-2 flex-shrink-0">
                                            {isCompleted && (
                                              <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-800 whitespace-nowrap"
                                              >
                                                Complete
                                              </Badge>
                                            )}
                                            {!isCompleted && weeklyProgress.onTrack && (
                                              <Badge
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800 whitespace-nowrap"
                                              >
                                                On Track
                                              </Badge>
                                            )}
                                            {!isCompleted && !weeklyProgress.onTrack && (
                                              <Badge
                                                variant="secondary"
                                                className="bg-yellow-100 text-yellow-800 whitespace-nowrap"
                                              >
                                                Behind
                                              </Badge>
                                            )}
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
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
                                                    setShowDeleteGoal({
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
                                        </div>
                                      </div>
                                    </div>

                                    {/* Progress bar and controls for number-based goals only */}
                                    {goalType !== "binary" && (
                                      <div className="space-y-3">
                                        <div className="space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                              {goal.targetCount >= 1000 &&
                                              (goal.title.toLowerCase().includes("$") ||
                                                goal.title.toLowerCase().includes("dollar") ||
                                                goal.title.toLowerCase().includes("funding") ||
                                                goal.title.toLowerCase().includes("revenue") ||
                                                goal.title.toLowerCase().includes("money"))
                                                ? `$${goal.currentCount.toLocaleString()} / $${goal.targetCount.toLocaleString()}`
                                                : `${goal.currentCount} / ${goal.targetCount}`}
                                            </span>
                                            <span className="font-medium text-gray-900">
                                              {Math.round(progressPercentage)}%
                                            </span>
                                          </div>
                                          <Progress value={progressPercentage} className="h-2 [&>div]:bg-[#05a7b0]" />
                                        </div>

                                        {/* Progress Update Controls */}
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-1">
                                            {goalType === "small" ? (
                                              // Small numbers - single + button
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => incrementGoal(category, goal.id, 1)}
                                                disabled={isCompleted}
                                                className="h-7 px-2"
                                              >
                                                <Plus className="h-3 w-3 mr-1" />
                                                +1
                                              </Button>
                                            ) : (
                                              // Medium/Large numbers - multiple increment buttons
                                              <>
                                                {quickIncrements.map((increment) => (
                                                  <Button
                                                    key={increment}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => incrementGoal(category, goal.id, increment)}
                                                    disabled={isCompleted}
                                                    className="h-7 px-2 text-xs"
                                                  >
                                                    +{increment >= 1000 ? `${increment / 1000}k` : increment}
                                                  </Button>
                                                ))}
                                              </>
                                            )}
                                          </div>

                                          {/* Direct input for medium/large goals */}
                                          {goalType !== "small" && (
                                            <div className="flex items-center space-x-2">
                                              <Input
                                                type="number"
                                                value={goal.currentCount}
                                                onChange={(e) =>
                                                  updateGoalProgress(
                                                    category,
                                                    goal.id,
                                                    Number.parseInt(e.target.value) || 0,
                                                  )
                                                }
                                                className="w-20 h-7 text-xs text-center"
                                                min="0"
                                                max={goal.targetCount}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Notes Section */}
                                    <div className="space-y-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleNotes(goal.id)}
                                        className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto"
                                      >
                                        {expandedNotes.has(goal.id) ? (
                                          <>
                                            <ChevronUp className="h-3 w-3 mr-1" />
                                            Hide notes
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="h-3 w-3 mr-1" />
                                            {goal.notes ? "Show notes" : "Add notes"}
                                          </>
                                        )}
                                      </Button>

                                      {expandedNotes.has(goal.id) && (
                                        <div className="animate-in slide-in-from-top-2 duration-200">
                                          <Textarea
                                            placeholder="Add notes about your progress..."
                                            value={goal.notes}
                                            onChange={(e) => updateNotes(category, goal.id, e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault()
                                                toggleNotes(goal.id)
                                              }
                                            }}
                                            className="min-h-[80px] text-sm"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Weekly Tasks View */}
                  <TabsContent value="weekly" className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Week {currentWeek} Tasks</h2>
                    </div>

                    {/* Group weekly tasks by category */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {Object.keys(goalsData).map((category) => {
                        const categoryTasks = (weeklyTasks[`Week ${currentWeek}`] || []).filter(
                          (task) => task.category === category,
                        )

                        if (categoryTasks.length === 0) return null

                        return (
                          <Card key={category} className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                  <Badge
                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                                  >
                                    {category}
                                  </Badge>
                                </CardTitle>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewWeeklyTask((prev) => ({ ...prev, category }))
                                    setShowAddWeeklyTask(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardDescription>
                                {categoryTasks.length} task{categoryTasks.length !== 1 ? "s" : ""} this week
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleWeeklyTaskDragEnd(event, category)}
                              >
                                <SortableContext
                                  items={categoryTasks.map((task) => task.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {categoryTasks.map((task) => (
                                    <SortableWeeklyTaskItem
                                      key={task.id}
                                      task={task}
                                      onToggle={() => toggleWeeklyTask(`Week ${currentWeek}`, task.id)}
                                      onEdit={() => startEditingWeeklyTask(task)}
                                      onDelete={() => {
                                        const deleteWeeklyTask = async (weekKey: string, taskId: string) => {
                                          try {
                                            await supabase.from("tasks").delete().eq("id", taskId)
                                            setWeeklyTasks((prev) => ({
                                              ...prev,
                                              [weekKey]: prev[weekKey]?.filter((task) => task.id !== taskId) || [],
                                            }))
                                          } catch (error) {
                                            console.error("Error deleting weekly task:", error)
                                            // Keep the task in UI if database deletion fails
                                          }
                                        }
                                        deleteWeeklyTask(`Week ${currentWeek}`, task.id)
                                      }}
                                      getPriorityColor={getPriorityColor}
                                    />
                                  ))}
                                </SortableContext>
                              </DndContext>
                            </CardContent>
                          </Card>
                        )
                      })}

                      {(() => {
                        const uncategorizedTasks = (weeklyTasks[`Week ${currentWeek}`] || []).filter(
                          (task) => task.category === "Uncategorized",
                        )

                        if (uncategorizedTasks.length === 0) return null

                        return (
                          <Card key="uncategorized" className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                    <Badge className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-700 border-gray-300">
                                      Uncategorized
                                    </Badge>
                                  </CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewWeeklyTask((prev) => ({ ...prev, category: "" }))
                                    setShowAddWeeklyTask(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleWeeklyTaskDragEnd(event, "Uncategorized")}
                              >
                                <SortableContext
                                  items={uncategorizedTasks.map((task) => task.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {uncategorizedTasks.map((task) => (
                                    <SortableWeeklyTaskItem
                                      key={task.id}
                                      task={task}
                                      onToggle={() => toggleWeeklyTask(`Week ${currentWeek}`, task.id)}
                                      onEdit={() => startEditingWeeklyTask(task)}
                                      onDelete={() => {
                                        const deleteWeeklyTask = async (weekKey: string, taskId: string) => {
                                          try {
                                            await supabase.from("tasks").delete().eq("id", taskId)
                                            setWeeklyTasks((prev) => ({
                                              ...prev,
                                              [weekKey]: prev[weekKey]?.filter((task) => task.id !== taskId) || [],
                                            }))
                                          } catch (error) {
                                            console.error("Error deleting weekly task:", error)
                                            // Keep the task in UI if database deletion fails
                                          }
                                        }
                                        deleteWeeklyTask(`Week ${currentWeek}`, task.id)
                                      }}
                                      getPriorityColor={getPriorityColor}
                                    />
                                  ))}
                                </SortableContext>
                              </DndContext>
                            </CardContent>
                          </Card>
                        )
                      })()}

                      {/* Show category cards even if empty, with plus buttons */}
                      {Object.keys(goalsData).map((category) => {
                        const categoryTasks = (weeklyTasks[`Week ${currentWeek}`] || []).filter(
                          (task) => task.category === category,
                        )

                        if (categoryTasks.length > 0) return null // Already rendered above

                        return (
                          <Card key={`empty-${category}`} className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                    <Badge
                                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                                    >
                                      {category}
                                    </Badge>
                                  </CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewWeeklyTask((prev) => ({ ...prev, category }))
                                    setShowAddWeeklyTask(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="py-8">
                              <div className="text-center text-gray-500">
                                <button
                                  onClick={() => {
                                    setNewWeeklyTask((prev) => ({ ...prev, category }))
                                    setShowAddWeeklyTask(true)
                                  }}
                                  className="text-sm hover:text-gray-700 cursor-pointer"
                                >
                                  Click + to add your first task
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}

                      {/* Show message if no tasks exist */}
                      {(!weeklyTasks[`Week ${currentWeek}`] || weeklyTasks[`Week ${currentWeek}`].length === 0) && (
                        <div className="col-span-2 text-center py-12">
                          <p className="text-gray-500 mb-4">No weekly tasks yet</p>
                          <p className="text-sm text-gray-400">Use the + buttons in each category to add tasks</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Daily Tasks View */}
                  <TabsContent value="daily" className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-gray-900">Daily Tasks</h2>
                        <Select value={selectedDay} onValueChange={setSelectedDay}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                              (day) => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(() => {
                      const allTasksForDay = dailyTasks[selectedDay] || []
                      console.log(`[v0] Daily tasks for ${selectedDay}:`, allTasksForDay.length)
                      console.log(`[v0] Task details:`, JSON.stringify(allTasksForDay, null, 2))
                      allTasksForDay.forEach((task) => {
                        console.log(
                          `[v0] Task "${task.title}" - category: "${task.category}", completed: ${task.completed}`,
                        )
                      })
                      return null
                    })()}

                    {/* Group daily tasks by category */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {Object.keys(goalsData).map((category) => {
                        const categoryTasks = (dailyTasks[selectedDay] || []).filter(
                          (task) => task.category === category,
                        )

                        if (categoryTasks.length === 0) return null

                        return (
                          <Card key={category} className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                    <Badge
                                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                                    >
                                      {category}
                                    </Badge>
                                  </CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewDailyTask((prev) => ({ ...prev, category }))
                                    setShowAddDailyTask(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleDailyTaskDragEnd(event, category)}
                              >
                                <SortableContext
                                  items={categoryTasks.map((task) => task.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {categoryTasks.map((task) => (
                                    <SortableDailyTaskItem
                                      key={task.id}
                                      task={task}
                                      onToggle={() => toggleDailyTask(selectedDay, task.id)}
                                      onEdit={() => startEditingDailyTask(task)}
                                      onDelete={() => deleteDailyTask(selectedDay, task.id)}
                                    />
                                  ))}
                                </SortableContext>
                              </DndContext>
                            </CardContent>
                          </Card>
                        )
                      })}

                      {(() => {
                        const uncategorizedTasks = (dailyTasks[selectedDay] || []).filter(
                          (task) => task.category === "Uncategorized",
                        )

                        if (uncategorizedTasks.length === 0) return null

                        return (
                          <Card key="uncategorized" className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                    <Badge className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-700 border-gray-300">
                                      Uncategorized
                                    </Badge>
                                  </CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewDailyTask((prev) => ({ ...prev, category: "" }))
                                    setShowAddDailyTask(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) => handleDailyTaskDragEnd(event, "Uncategorized")}
                              >
                                <SortableContext
                                  items={uncategorizedTasks.map((task) => task.id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {uncategorizedTasks.map((task) => (
                                    <SortableDailyTaskItem
                                      key={task.id}
                                      task={task}
                                      onToggle={() => toggleDailyTask(selectedDay, task.id)}
                                      onEdit={() => startEditingDailyTask(task)}
                                      onDelete={() => deleteDailyTask(selectedDay, task.id)}
                                    />
                                  ))}
                                </SortableContext>
                              </DndContext>
                            </CardContent>
                          </Card>
                        )
                      })()}

                      {/* Show category cards even if empty, with plus buttons */}
                      {Object.keys(goalsData).map((category) => {
                        const categoryTasks = (dailyTasks[selectedDay] || []).filter(
                          (task) => task.category === category,
                        )

                        if (categoryTasks.length > 0) return null // Already rendered above

                        return (
                          <Card key={`empty-${category}`} className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                    <Badge
                                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                                    >
                                      {category}
                                    </Badge>
                                  </CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setNewDailyTask((prev) => ({ ...prev, category }))
                                    setShowAddDailyTask(true)
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="py-8">
                              <div className="text-center text-gray-500">
                                <button
                                  onClick={() => {
                                    setNewDailyTask((prev) => ({ ...prev, category }))
                                    setShowAddDailyTask(true)
                                  }}
                                  className="text-sm hover:text-gray-700 cursor-pointer"
                                >
                                  Click + to add your first task
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>

                  {/* 1-Year Goals View */}
                  <TabsContent value="1-year" className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">1-Year Goals</h2>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedTimeframe("1-year")
                          setShowAddLongTermGoal(true)
                        }}
                        className="text-sm bg-black hover:bg-black/90 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add 1-Year Goal
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {Object.entries(longTermGoals["1-year"]).map(([category, goals]) => (
                        <Card
                          key={category}
                          className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <Badge
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                              >
                                {category}
                              </Badge>
                              <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setSelectedTimeframe("1-year")
                                        setShowAddLongTermGoal(true)
                                      }}
                                    >
                                      <Target className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setSelectedTimeframe("1-year")
                                        setShowAddLongTermGoal(true)
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => startEditingCategory(category)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (goals.length === 0) {
                                          deleteCategory(category)
                                        }
                                      }}
                                      className={goals.length > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-600"}
                                      disabled={goals.length > 0}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {goals.length > 0 ? "Delete Category (remove goals first)" : "Delete Category"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <CardDescription className="mt-2">
                              {goals.length} goal{goals.length !== 1 ? "s" : ""} • Long-term vision
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {goals.map((goal) => (
                              <div key={goal.id} className="p-4 rounded-lg bg-gray-50 border border-border space-y-4">
                                <div className="flex items-start space-x-3">
                                  <Checkbox
                                    checked={goal.status === "completed"}
                                    onCheckedChange={async (checked) => {
                                      const isValidUUID =
                                        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goal.id)

                                      if (isValidUUID) {
                                        // Database goal - update both database and local state
                                        try {
                                          const { error } = await supabase
                                            .from("long_term_goals")
                                            .update({
                                              completed: !!checked,
                                              completed_at: checked ? new Date().toISOString() : null,
                                            })
                                            .eq("id", goal.id)

                                          if (error) throw error

                                          const newStatus = checked ? "completed" : "in-progress"
                                          setLongTermGoals((prev) => ({
                                            ...prev,
                                            "1-year": {
                                              ...prev["1-year"],
                                              [category]: prev["1-year"][category].map((g) =>
                                                g.id === goal.id ? { ...g, status: newStatus } : g,
                                              ),
                                            },
                                          }))
                                        } catch (error) {
                                          console.error("Error updating long-term goal:", error)
                                        }
                                      } else {
                                        // Local goal - update only local state
                                        const newStatus = checked ? "completed" : "in-progress"
                                        setLongTermGoals((prev) => ({
                                          ...prev,
                                          "1-year": {
                                            ...prev["1-year"],
                                            [category]: prev["1-year"][category].map((g) =>
                                              g.id === goal.id ? { ...g, status: newStatus } : g,
                                            ),
                                          },
                                        }))
                                      }
                                    }}
                                    className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4
                                          className={`font-semibold mb-2 ${goal.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}
                                        >
                                          {goal.title}
                                        </h4>
                                        <p
                                          className={`text-sm mb-3 ${goal.status === "completed" ? "text-gray-400" : "text-gray-600"}`}
                                        >
                                          {goal.description}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                          <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                                          <Badge
                                            variant="secondary"
                                            className={
                                              goal.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : goal.status === "on-hold"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-blue-100 text-blue-800"
                                            }
                                          >
                                            {goal.status.replace("-", " ")}
                                          </Badge>
                                        </div>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() => startEditingLongTermGoal("1-year", category, goal)}
                                          >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Goal
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setShowDeleteLongTermGoal({
                                                timeframe: "1-year",
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
                                  </div>
                                </div>

                                {/* Milestones */}
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium text-gray-700">Milestones</h5>
                                  <div className="space-y-2">
                                    {goal.milestones.map((milestone, index) => (
                                      <div key={milestone.id} className="flex items-center space-x-3">
                                        <Checkbox
                                          checked={milestone.completed}
                                          onCheckedChange={(checked) => {
                                            setLongTermGoals((prev) => ({
                                              ...prev,
                                              "1-year": {
                                                ...prev["1-year"],
                                                [category]: prev["1-year"][category].map((g) =>
                                                  g.id === goal.id
                                                    ? {
                                                        ...g,
                                                        milestones: g.milestones.map((m) =>
                                                          m.id === milestone.id ? { ...m, completed: !!checked } : m,
                                                        ),
                                                      }
                                                    : g,
                                                ),
                                              },
                                            }))
                                          }}
                                          className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                                        />
                                        <div className="flex-1">
                                          <span
                                            className={`text-sm ${milestone.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                                          >
                                            {milestone.title}
                                          </span>
                                          <span className="text-xs text-gray-500 ml-2">
                                            {new Date(milestone.targetDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Notes */}
                                {goal.notes && (
                                  <div className="pt-2 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">{goal.notes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 5-Year Goals View */}
                  <TabsContent value="5-year" className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">5-Year Goals</h2>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedTimeframe("5-year")
                          setShowAddLongTermGoal(true)
                        }}
                        className="text-sm bg-black hover:bg-black/90 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add 5-Year Goal
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {Object.entries(longTermGoals["5-year"]).map(([category, goals]) => (
                        <Card
                          key={category}
                          className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <Badge
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                              >
                                {category}
                              </Badge>
                              <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setSelectedTimeframe("5-year")
                                        setShowAddLongTermGoal(true)
                                      }}
                                    >
                                      <Target className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setSelectedTimeframe("5-year")
                                        setShowAddLongTermGoal(true)
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => startEditingCategory(category)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (goals.length === 0) {
                                          deleteCategory(category)
                                        }
                                      }}
                                      className={goals.length > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-600"}
                                      disabled={goals.length > 0}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      {goals.length > 0 ? "Delete Category (remove goals first)" : "Delete Category"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <CardDescription className="mt-2">
                              {goals.length} goal{goals.length !== 1 ? "s" : ""} • Long-term vision
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {goals.map((goal) => (
                              <div key={goal.id} className="p-4 rounded-lg bg-gray-50 border border-border space-y-4">
                                <div className="flex items-start space-x-3">
                                  <Checkbox
                                    checked={goal.status === "completed"}
                                    onCheckedChange={async (checked) => {
                                      const isValidUUID =
                                        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goal.id)

                                      if (isValidUUID) {
                                        // Database goal - update both database and local state
                                        try {
                                          const { error } = await supabase
                                            .from("long_term_goals")
                                            .update({
                                              completed: !!checked,
                                              completed_at: checked ? new Date().toISOString() : null,
                                            })
                                            .eq("id", goal.id)

                                          if (error) throw error

                                          const newStatus = checked ? "completed" : "in-progress"
                                          setLongTermGoals((prev) => ({
                                            ...prev,
                                            "5-year": {
                                              ...prev["5-year"],
                                              [category]: prev["5-year"][category].map((g) =>
                                                g.id === goal.id ? { ...g, status: newStatus } : g,
                                              ),
                                            },
                                          }))
                                        } catch (error) {
                                          console.error("Error updating long-term goal:", error)
                                        }
                                      } else {
                                        // Local goal - update only local state
                                        const newStatus = checked ? "completed" : "in-progress"
                                        setLongTermGoals((prev) => ({
                                          ...prev,
                                          "5-year": {
                                            ...prev["5-year"],
                                            [category]: prev["5-year"][category].map((g) =>
                                              g.id === goal.id ? { ...g, status: newStatus } : g,
                                            ),
                                          },
                                        }))
                                      }
                                    }}
                                    className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4
                                          className={`font-semibold mb-2 ${goal.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}
                                        >
                                          {goal.title}
                                        </h4>
                                        <p
                                          className={`text-sm mb-3 ${goal.status === "completed" ? "text-gray-400" : "text-gray-600"}`}
                                        >
                                          {goal.description}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                          <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                                          <Badge
                                            variant="secondary"
                                            className={
                                              goal.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : goal.status === "on-hold"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-blue-100 text-blue-800"
                                            }
                                          >
                                            {goal.status.replace("-", " ")}
                                          </Badge>
                                        </div>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={() => startEditingLongTermGoal("5-year", category, goal)}
                                          >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Goal
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setShowDeleteLongTermGoal({
                                                timeframe: "5-year",
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
                                  </div>
                                </div>

                                {/* Milestones */}
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium text-gray-700">Milestones</h5>
                                  <div className="space-y-2">
                                    {goal.milestones.map((milestone, index) => (
                                      <div key={milestone.id} className="flex items-center space-x-3">
                                        <Checkbox
                                          checked={milestone.completed}
                                          onCheckedChange={(checked) => {
                                            setLongTermGoals((prev) => ({
                                              ...prev,
                                              "5-year": {
                                                ...prev["5-year"],
                                                [category]: prev["5-year"][category].map((g) =>
                                                  g.id === goal.id
                                                    ? {
                                                        ...g,
                                                        milestones: g.milestones.map((m) =>
                                                          m.id === milestone.id ? { ...m, completed: !!checked } : m,
                                                        ),
                                                      }
                                                    : g,
                                                ),
                                              },
                                            }))
                                          }}
                                          className={`h-5 w-5 mt-0.5 flex-shrink-0 ${checkboxStyles}`}
                                        />
                                        <div className="flex-1">
                                          <span
                                            className={`text-sm ${milestone.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                                          >
                                            {milestone.title}
                                          </span>
                                          <span className="text-xs text-gray-500 ml-2">
                                            {new Date(milestone.targetDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Notes */}
                                {goal.notes && (
                                  <div className="pt-2 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">{goal.notes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Agents Page Content */}
                {currentPage === "agents" ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
                        <p className="text-muted-foreground">Manage your team members</p>
                      </div>
                      <Button onClick={() => setShowAddAgent(true)} className="bg-black hover:bg-black/90 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Agent
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {agents.map((agent) => (
                        <Card key={agent.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="size-12">
                                  <AvatarFallback className="bg-[#05a7b0] text-white">
                                    {agent.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                                  <Badge variant="secondary" className="mt-1">
                                    {agent.role}
                                  </Badge>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditingAgent(agent)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteAgent(agent.id)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          {agent.description && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{agent.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>

                    {agents.length === 0 && (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Users className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Get started by adding your first team member
                          </p>
                          <Button
                            onClick={() => setShowAddAgent(true)}
                            className="bg-black hover:bg-black/90 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Agent
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* Add Agent Dialog */}
                    {showAddAgent && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-md mx-4">
                          <CardHeader>
                            <CardTitle>Add New Agent</CardTitle>
                            <CardDescription>Add a new team member to your organization</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Name</label>
                              <Input
                                placeholder="Enter agent name"
                                value={newAgent.name}
                                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Role</label>
                              <Input
                                placeholder="Enter role (e.g., Sales Agent, Manager)"
                                value={newAgent.role}
                                onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description (Optional)</label>
                              <Textarea
                                placeholder="Enter description"
                                value={newAgent.description}
                                onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                          </CardContent>
                          <div className="flex justify-end gap-2 p-6 pt-0">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowAddAgent(false)
                                setNewAgent({ name: "", role: "", description: "" })
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                console.log("[v0] Add Agent button clicked")
                                console.log("[v0] newAgent state:", newAgent)
                                console.log("[v0] Button disabled?", !newAgent.name.trim() || !newAgent.role.trim())
                                addAgent()
                              }}
                              className="w-full bg-black hover:bg-black/90 text-white"
                            >
                              Add Agent
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}

                    {/* Edit Agent Dialog */}
                    {editingAgent && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-md mx-4">
                          <CardHeader>
                            <CardTitle>Edit Agent</CardTitle>
                            <CardDescription>Update agent information</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Name</label>
                              <Input
                                placeholder="Enter agent name"
                                value={editingAgent.name}
                                onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Role</label>
                              <Input
                                placeholder="Enter role"
                                value={editingAgent.role}
                                onChange={(e) => setEditingAgent({ ...editingAgent, role: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description (Optional)</label>
                              <Textarea
                                placeholder="Enter description"
                                value={editingAgent.description}
                                onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                          </CardContent>
                          <div className="flex justify-end gap-2 p-6 pt-0">
                            <Button variant="outline" onClick={() => setEditingAgent(null)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={updateAgent}
                              className="bg-black hover:bg-black/90 text-white"
                              disabled={!editingAgent.name.trim() || !editingAgent.role.trim()}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default function Page() {
  const { user, isLoading } = useAuth()

  console.log("[v0] Page render - user:", user, "isLoading:", isLoading)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return <GoalTrackerApp />
}

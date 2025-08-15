"use client"
import { supabase } from "@/lib/supabase/client"
import { DialogFooter } from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"

import { DialogDescription } from "@/components/ui/dialog"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import { DialogContent } from "@/components/ui/dialog"

import { Dialog } from "@/components/ui/dialog"

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

// Auth components
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { AuthScreen } from "@/components/auth/auth-screen"
import { UserProfile } from "@/components/auth/user-profile"

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
  const { user } = useAuth()
  const [goalsData, setGoalsData] = useState<GoalsData>(initialGoalsData)
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [activeView, setActiveView] = useState("daily")
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

  const [weeklyTasks, setWeeklyTasks] = useState<Record<string, WeeklyTask[]>>({})
  const [dailyTasks, setDailyTasks] = useState<Record<string, DailyTask[]>>({})

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

  useEffect(() => {
    const checkDatabaseAndLoadData = async () => {
      if (user?.id) {
        console.log("User authenticated, checking database connection...")

        try {
          // Test database connection
          const { data, error } = await supabase.from("categories").select("count").limit(1)

          if (error) {
            console.error("Database connection failed:", error)
          } else {
            console.log("Database connection successful!")

            const startDateKey = `goalTracker_startDate_${user.id}`
            let startDate = localStorage.getItem(startDateKey)

            if (!startDate) {
              startDate = new Date().toISOString()
              localStorage.setItem(startDateKey, startDate)
            }

            const start = new Date(startDate)
            const today = new Date()
            const daysDiff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            const weekNumber = Math.floor(daysDiff / 7) + 1
            const calculatedWeek = Math.min(Math.max(weekNumber, 1), 12)

            setCurrentWeek(calculatedWeek)

            const dbData = await loadCategoriesAndGoalsFromDB(user.id)
            const taskData = await loadTasksFromDB(user.id)

            console.log("=== COMPREHENSIVE TASK LOADING DEBUG ===")
            console.log("Raw task data from database:", JSON.stringify(taskData, null, 2))
            console.log("Daily tasks structure:", JSON.stringify(taskData.dailyTasks, null, 2))
            console.log("Weekly tasks structure:", JSON.stringify(taskData.weeklyTasks, null, 2))

            setGoalsData(dbData)

            console.log("=== FORCING STATE UPDATES ===")

            // Update daily tasks with force re-render
            setDailyTasks(() => {
              console.log("Setting daily tasks to:", JSON.stringify(taskData.dailyTasks, null, 2))
              return { ...taskData.dailyTasks }
            })

            // Update weekly tasks with force re-render
            setWeeklyTasks(() => {
              console.log("Setting weekly tasks to:", JSON.stringify(taskData.weeklyTasks, null, 2))
              return { ...taskData.weeklyTasks }
            })

            setTimeout(() => {
              console.log("=== POST-UPDATE VERIFICATION ===")
              console.log("Daily tasks count:", Object.keys(taskData.dailyTasks).length)
              console.log("Weekly tasks count:", Object.keys(taskData.weeklyTasks).length)
              console.log("State update completed successfully")
            }, 100)
          }
        } catch (error) {
          console.error("Error loading data:", error)
        }
      }
    }

    checkDatabaseAndLoadData()
  }, [user?.id])

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
    // Check if this is a local goal (starts with letters) or database goal (UUID format)
    const isLocalGoal = /^[a-zA-Z]/.test(goalId)

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
      if (!goal) return

      const newProgress = goal.currentCount >= goal.targetCount ? 0 : goal.targetCount
      const isCompleted = newProgress >= goal.targetCount

      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((goal) => (goal.id === goalId ? { ...goal, currentCount: newProgress } : goal)),
      }))

      // Update database
      const { error } = await supabase
        .from("goals")
        .update({
          current_progress: newProgress,
          completed: isCompleted,
        })
        .eq("id", goalId)

      if (error) {
        console.error("Error updating goal completion:", error.message)
        setGoalsData((prev) => ({
          ...prev,
          [category]: prev[category].map((goal) =>
            goal.id === goalId ? { ...goal, currentCount: goal.currentCount } : goal,
          ),
        }))
        return
      }
    } catch (error) {
      console.error("Error updating goal completion:", error)
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
      if (!user?.id) {
        alert("User not authenticated. Please log in again.")
        return
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(user.id)) {
        console.error("Invalid user ID format:", user.id)
        alert("Authentication error. Please log out and log in again.")
        return
      }

      const { error } = await supabase.from("categories").insert([
        {
          user_id: user.id,
          name: categoryName,
          color: "#05a7b0", // Default teal color
        },
      ])

      if (error) {
        console.error("Error saving category:", error)
        console.error("User ID being used:", user.id)
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

  const deleteGoal = (category: string, goalId: string) => {
    setGoalsData((prev) => ({
      ...prev,
      [category]: prev[category].filter((goal) => goal.id !== goalId),
    }))
    setShowDeleteGoal(null)
  }

  const updateGoal = () => {
    if (!editingGoal) return

    const weeklyTargetValue = newGoal.weeklyTarget || Math.ceil(newGoal.targetCount / 12)

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

  const startEditingCategory = (category: string) => {
    setShowEditCategory(category)
    setEditCategoryName(category)
    setEditCategoryColor(customCategoryColors[category] || getCategoryColor(category))
  }

  const saveEditedCategory = () => {
    if (!showEditCategory || !editCategoryName.trim()) return

    const oldCategoryName = showEditCategory
    const newCategoryName = editCategoryName.trim()

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
  }

  const deleteCategory = (category: string) => {
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
    let totalCurrent = 0
    let totalTarget = 0

    Object.values(goalsData).forEach((goals) => {
      goals.forEach((goal) => {
        totalCurrent += goal.currentCount
        totalTarget += goal.targetCount
      })
    })

    return totalTarget === 0 ? 0 : Math.round((totalCurrent / totalTarget) * 100)
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

  const toggleWeeklyTask = async (taskId: string) => {
    // Find the current task to get its completion status
    const currentTask = weeklyTasks[`Week ${currentWeek}`]?.find((task) => task.id === taskId)
    if (!currentTask) return

    const newCompletedStatus = !currentTask.completed

    // Update local state immediately for UI feedback
    setWeeklyTasks((prev) => ({
      ...prev,
      [`Week ${currentWeek}`]:
        prev[`Week ${currentWeek}`]?.map((task) =>
          task.id === taskId ? { ...task, completed: newCompletedStatus } : task,
        ) || [],
    }))

    // Update database
    try {
      const { error } = await supabase.from("tasks").update({ completed: newCompletedStatus }).eq("id", taskId)

      if (error) {
        console.error("Error updating task completion:", error)
        // Revert local state on error
        setWeeklyTasks((prev) => ({
          ...prev,
          [`Week ${currentWeek}`]:
            prev[`Week ${currentWeek}`]?.map((task) =>
              task.id === taskId ? { ...task, completed: currentTask.completed } : task,
            ) || [],
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
    console.log("=== TASK CREATION DEBUG START ===")
    console.log("1. Function called, newDailyTask:", newDailyTask)

    if (!newDailyTask.title) {
      console.log("2. No title provided, exiting")
      return
    }

    const taskId = crypto.randomUUID()
    console.log("3. Generated task ID:", taskId)

    const taskData = {
      title: newDailyTask.title,
      description: newDailyTask.description,
      category: newDailyTask.category,
      goalId: newDailyTask.goalId,
    }
    console.log("4. Task data prepared:", taskData)

    console.log("5. User object:", user)
    console.log("6. User ID:", user?.id)
    console.log("7. User authenticated:", !!user)

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
    console.log("8. Local state updated")

    // Reset form
    setNewDailyTask({
      title: "",
      description: "",
      category: "",
      goalId: "",
    })
    setShowAddDailyTask(false)
    console.log("9. Form reset and dialog closed")

    try {
      console.log("10. Starting database operation...")

      if (!user?.id) {
        console.error("11. ERROR: No user ID available")
        console.log("User object:", user)
        return
      }

      // Look up category ID if category is provided (same as weekly tasks)
      let categoryId = null
      if (taskData.category) {
        console.log("12. Looking up category:", taskData.category)
        const { data: categories } = await supabase
          .from("categories")
          .select("id")
          .eq("name", taskData.category)
          .eq("user_id", user.id)
          .single()

        categoryId = categories?.id || null
        console.log("13. Category ID found:", categoryId)
      }

      const insertData = {
        id: taskId,
        user_id: user.id,
        category_id: categoryId,
        goal_id: taskData.goalId || null,
        title: taskData.title,
        description: taskData.description,
        task_type: "daily",
        target_date: new Date().toISOString().split("T")[0],
        completed: false,
      }
      console.log("14. Insert data prepared:", insertData)

      console.log("15. Calling supabase.from('tasks').insert()...")
      const { data, error } = await supabase.from("tasks").insert(insertData).select()

      console.log("16. Database response - data:", data)
      console.log("17. Database response - error:", error)

      if (error) {
        console.error("18. DATABASE ERROR:", error)
        console.error("Error message:", error.message)
        console.error("Error details:", error.details)
        console.error("Error hint:", error.hint)
      } else {
        console.log("19. Task saved successfully:", data)

        // Verify it was saved
        console.log("20. Starting verification query...")
        const { data: verification, error: verifyError } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)

        console.log("21. Verification data:", verification)
        console.log("22. Verification error:", verifyError)

        if (verification && verification.length > 0) {
          console.log("23. SUCCESS: Task verified in database:", verification[0])
        } else {
          console.log("24. WARNING: Task not found in verification query")
        }
      }
    } catch (err) {
      console.error("25. EXCEPTION during database operation:", err)
    }

    console.log("=== TASK CREATION DEBUG END ===")
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
    })
    setShowAddWeeklyTask(false)
  }

  async function loadTasksFromDB(userId: string) {
    try {
      console.log("=== LOADING TASKS FROM DATABASE ===")
      console.log("Fetching tasks for user ID:", userId)

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select(`
        *,
        categories (
          name
        )
      `)
        .eq("user_id", userId)

      if (tasksError) {
        console.error("Error fetching tasks:", tasksError)
        return { weeklyTasks: {}, dailyTasks: {} }
      }

      console.log("Raw tasks from database:", JSON.stringify(tasks, null, 2))
      console.log("Number of tasks found:", tasks?.length || 0)

      const weeklyTasks: Record<string, WeeklyTask[]> = {}
      const dailyTasks: Record<string, DailyTask[]> = {}

      tasks.forEach((task, index) => {
        console.log(`Processing task ${index + 1}:`, JSON.stringify(task, null, 2))

        const categoryName = task.categories?.name || "Uncategorized"

        if (task.task_type === "weekly") {
          const weekKey = `Week ${currentWeek}`
          console.log(`Adding weekly task to current ${weekKey}`)

          const weeklyTask: WeeklyTask = {
            id: task.id,
            title: task.title || "",
            description: task.description || "",
            category: categoryName, // Use actual category name
            goalId: task.goal_id || "",
            completed: task.completed || false,
            priority: "medium",
            estimatedHours: 1,
          }

          if (!weeklyTasks[weekKey]) {
            weeklyTasks[weekKey] = []
          }
          weeklyTasks[weekKey].push(weeklyTask)
        } else if (task.task_type === "daily") {
          const today = new Date()
          const day = today.toLocaleDateString("en-US", { weekday: "long" })
          console.log(`Adding daily task to current ${day}`)

          const dailyTask: DailyTask = {
            id: task.id,
            title: task.title || "",
            description: task.description || "",
            category: categoryName, // Use actual category name
            goalId: task.goal_id || "",
            completed: task.completed || false,
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
          const timeframe = goal.timeframe as "1-year" | "5-year"
          const category = goal.category

          if (!groupedGoals[timeframe][category]) {
            groupedGoals[timeframe][category] = []
          }

          groupedGoals[timeframe][category].push({
            id: goal.id,
            title: goal.title,
            description: goal.description || "",
            targetDate: goal.target_date,
            category: goal.category,
            status: goal.completed ? "completed" : "in-progress",
            notes: goal.notes || "",
            milestones: goal.milestones || [],
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

  useEffect(() => {
    if (user?.id) {
      loadLongTermGoalsFromDB()
    }
  }, [user?.id])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi {user?.name?.split(" ")[0] || "there"},</h1>
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
            {/* User Profile Button */}
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
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
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
                  <Progress value={((12 - (12 - currentWeek)) / 12) * 100} className="h-2 [&>div]:bg-[#05a7b0]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="12-week">12-Week</TabsTrigger>
            <TabsTrigger value="1-year">1-Year</TabsTrigger>
            <TabsTrigger value="5-year">5-Year</TabsTrigger>
          </TabsList>

          {/* 12-Week Goals View */}
          <TabsContent value="12-week" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(goalsData).map(([category, goals]) => (
                <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
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
                              onClick={() => setShowDeleteCategory(category)}
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
                          <div key={goal.id} className="p-3 rounded-lg bg-gray-50 border border-border space-y-3">
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
                                    <span className="font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
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
                                          updateGoalProgress(category, goal.id, Number.parseInt(e.target.value) || 0)
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
                              onToggle={() => toggleWeeklyTask(task.id)}
                              onEdit={() => startEditingWeeklyTask(task)}
                              onDelete={() => setShowDeleteWeeklyTask({ taskId: task.id, title: task.title })}
                              getPriorityColor={getPriorityColor}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </CardContent>
                  </Card>
                )
              })}

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
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Group daily tasks by category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.keys(goalsData).map((category) => {
                const categoryTasks = (dailyTasks[selectedDay] || []).filter((task) => task.category === category)

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
                              onDelete={() =>
                                setShowDeleteDailyTask({ day: selectedDay, taskId: task.id, title: task.title })
                              }
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Show category cards even if empty, with plus buttons */}
              {Object.keys(goalsData).map((category) => {
                const categoryTasks = (dailyTasks[selectedDay] || []).filter((task) => task.category === category)

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
                className="text-sm bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add 1-Year Goal
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(longTermGoals["1-year"]).map(([category, goals]) => (
                <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                      >
                        {category}
                      </Badge>
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
                                  <DropdownMenuItem onClick={() => startEditingLongTermGoal("1-year", category, goal)}>
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
                                  className={`h-4 w-4 ${checkboxStyles}`}
                                />
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${milestone.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                                  >
                                    {milestone.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Due: {new Date(milestone.targetDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

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
                className="text-sm bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add 5-Year Goal
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(longTermGoals["5-year"]).map(([category, goals]) => (
                <Card key={category} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                      >
                        {category}
                      </Badge>
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
                                  // Revert local state if database update fails
                                  setLongTermGoals((prev) => ({
                                    ...prev,
                                    "5-year": {
                                      ...prev["5-year"],
                                      [category]: prev["5-year"][category].map((g) =>
                                        g.id === goal.id ? { ...g, status: goal.status } : g,
                                      ),
                                    },
                                  }))
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
                                  <DropdownMenuItem onClick={() => startEditingLongTermGoal("5-year", category, goal)}>
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
                                  className={`h-4 w-4 ${checkboxStyles}`}
                                />
                                <div className="flex-1">
                                  <p
                                    className={`text-sm ${milestone.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                                  >
                                    {milestone.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Due: {new Date(milestone.targetDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

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

        {/* Add Goal Dialog */}
        <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
              <DialogDescription>
                {editingGoal
                  ? "Update your goal details below."
                  : selectedCategory
                    ? `Add a new goal to ${selectedCategory}`
                    : "Add a new goal to your 12-week plan"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!editingGoal && !selectedCategory && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
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
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Run 120 miles"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Brief description of your goal"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetCount" className="text-right">
                  Target
                </Label>
                <Input
                  id="targetCount"
                  type="number"
                  value={newGoal.targetCount || ""}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, targetCount: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="col-span-3"
                  placeholder="Target number (auto-detected from title)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weeklyTarget" className="text-right">
                  Weekly Target
                </Label>
                <Input
                  id="weeklyTarget"
                  type="number"
                  step="0.1"
                  value={newGoal.weeklyTarget || ""}
                  onChange={(e) =>
                    setNewGoal((prev) => ({ ...prev, weeklyTarget: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="col-span-3"
                  placeholder={`Suggested: ${Math.ceil((newGoal.targetCount || 1) / 12)}`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={editingGoal ? saveEditedGoal : addNewGoal}
                disabled={!newGoal.title || (!editingGoal && !selectedCategory)}
              >
                {editingGoal ? "Update Goal" : "Add Goal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new category to organize your goals and tasks.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryName" className="text-right">
                  Name
                </Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Health & Fitness"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={addNewCategory} disabled={!newCategoryName.trim()}>
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Weekly Task Dialog */}
        <Dialog open={showAddWeeklyTask} onOpenChange={setShowAddWeeklyTask}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingWeeklyTask ? "Edit Weekly Task" : "Add Weekly Task"}</DialogTitle>
              <DialogDescription>
                {editingWeeklyTask
                  ? "Update your weekly task details."
                  : "Create a task to work on this week that contributes to your 12-week goals."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taskTitle" className="text-right">
                  Task Title
                </Label>
                <Input
                  id="taskTitle"
                  value={newWeeklyTask.title}
                  onChange={(e) => setNewWeeklyTask((prev) => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Complete pitch deck"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taskDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="taskDescription"
                  value={newWeeklyTask.description}
                  onChange={(e) => setNewWeeklyTask((prev) => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Brief description of the task"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taskCategory" className="text-right">
                  Category
                </Label>
                <Select
                  value={newWeeklyTask.category}
                  onValueChange={(value) => setNewWeeklyTask((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
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
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={editingWeeklyTask ? saveEditedWeeklyTask : addWeeklyTask}
                disabled={!newWeeklyTask.title || !newWeeklyTask.category}
              >
                {editingWeeklyTask ? "Update Task" : "Add Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Daily Task Dialog */}
        <Dialog open={showAddDailyTask} onOpenChange={setShowAddDailyTask}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingDailyTask ? "Edit Daily Task" : "Add Daily Task"}</DialogTitle>
              <DialogDescription>
                {editingDailyTask
                  ? "Update your daily task details."
                  : `Create a daily task for ${selectedDay} in ${newDailyTask.category || "your selected category"}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dailyTaskTitle" className="text-right">
                  Task Title
                </Label>
                <Input
                  id="dailyTaskTitle"
                  value={newDailyTask.title}
                  onChange={(e) => setNewDailyTask((prev) => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Morning workout"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dailyTaskDescription" className="text-right">
                  Description (optional)
                </Label>
                <Textarea
                  id="dailyTaskDescription"
                  value={newDailyTask.description}
                  onChange={(e) => setNewDailyTask((prev) => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Brief description of the task"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dailyTaskCategory" className="text-right">
                  Category
                </Label>
                <Select
                  value={newDailyTask.category}
                  onValueChange={(value) => setNewDailyTask((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDailyTask(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={editingDailyTask ? saveEditedDailyTask : addDailyTask}
                disabled={!newDailyTask.title}
              >
                {editingDailyTask ? "Update Task" : "Add Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Profile Dialog */}
        {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
      </div>
    </div>
  )
}

async function loadCategoriesAndGoalsFromDB(userId: string) {
  try {
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        color,
        goals (
          id,
          title,
          description,
          target_count,
          current_progress,
          weekly_target,
          completed
        )
      `)
      .eq("user_id", userId)

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return initialGoalsData
    }

    const goalsData: GoalsData = {}

    categories.forEach((category) => {
      const categoryGoals = category.goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        description: goal.description || "",
        targetCount: goal.target_count,
        currentCount: goal.current_progress,
        notes: "",
        weeklyTarget: goal.weekly_target,
        category: category.name,
      }))

      goalsData[category.name] = categoryGoals
    })

    // Merge with initial data for categories that don't exist in database
    const mergedData = { ...initialGoalsData, ...goalsData }
    return mergedData
  } catch (error) {
    console.error("Error loading categories and goals:", error)
    return initialGoalsData
  }
}

function Page() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Goal Tracker</h1>
          <p className="text-gray-600">Loading your goals and tasks...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return <GoalTrackerApp />
}

export default Page

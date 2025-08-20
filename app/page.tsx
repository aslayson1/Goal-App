"use client"
import { supabase } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Auth components
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"

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

  const deleteGoal = async (category: string, goalId: string) => {
    try {
      await supabase.from("goals").delete().eq("id", goalId)
      setGoalsData((prev) =>
        ({
          ...prev,
          [category]: prev[category].filter((goal) => goal.id !== goalId),
        })
      )
      setShowDeleteGoal(null)
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  const deleteCategory = async (categoryName: string) => {
    try {
      if (!user?.id) {
        alert("User not authenticated. Please log in again.")
        return
      }

      // Find the category ID from the database
      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", categoryName)
        .eq("user_id", user.id)
        .single()

      if (categoryError) {
        console.error("Error fetching category:", categoryError)
        alert("Failed to fetch category. Please try again.")
        return
      }

      if (!categories) {
        console.error("Category not found in database")
        alert("Category not found. It may have already been deleted.")
        return
      }

      // Delete the category from the database
      const { error: deleteError } = await supabase.from("categories").delete().eq("id", categories.id)

      if (deleteError) {
        console.error("Error deleting category:", deleteError)
        alert(`Failed to delete category: ${deleteError.message}`)
        return
      }

      // Update local state
      setGoalsData((prev) => {
        const { [categoryName]: deletedCategory, ...rest } = prev
        return rest
      })

      setShowDeleteCategory(null)
      console.log("Category deleted successfully:", categoryName)
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Failed to delete category. Please try again.")
    }
  }

  const editCategory = async (oldCategoryName: string, newCategoryName: string, newCategoryColor: string) => {
    if (!newCategoryName.trim()) return

    // Convert to title case instead of uppercase
    const categoryName = newCategoryName
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    if (goalsData[categoryName] && categoryName !== oldCategoryName) {
      alert("Category already exists!")
      return
    }

    try {
      if (!user?.id) {
        alert("User not authenticated. Please log in again.")
        return
      }

      // Find the category ID from the database
      const { data: categories, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("name", oldCategoryName)
        .eq("user_id", user.id)
        .single()

      if (categoryError) {
        console.error("Error fetching category:", categoryError)
        alert("Failed to fetch category. Please try again.")
        return
      }

      if (!categories) {
        console.error("Category not found in database")
        alert("Category not found. It may have already been deleted.")
        return
      }

      // Update the category in the database
      const { error: updateError } = await supabase
        .from("categories")
        .update({
          name: categoryName,
          color: newCategoryColor,
        })
        .eq("id", categories.id)

      if (updateError) {
        console.error("Error updating category:", updateError)
        alert(`Failed to update category: ${updateError.message}`)
        return
      }

      // Update local state
      setGoalsData((prev) => {
        const { [oldCategoryName]: oldCategory, ...rest } = prev
        return {
          ...rest,
          [categoryName]: oldCategory || [],
        }
      })

      setCustomCategoryColors((prev) => ({
        ...prev,
        [categoryName]: newCategoryColor,
      }))

      setShowEditCategory(null)
      setEditCategoryName("")
      setEditCategoryColor("")
      console.log("Category updated successfully:", categoryName)
    } catch (error) {
      console.error("Error updating category:", error)
      alert("Failed to update category. Please try again.")
    }
  }

  const addNewWeeklyTask = async () => {
    if (!newWeeklyTask.title.trim() || !newWeeklyTask.category.trim() || !newWeeklyTask.goalId.trim()) {
      alert("Please fill in all fields for the weekly task.")
      return
    }

    const weekKey = `Week ${currentWeek}`
    const taskId = crypto.randomUUID()

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

    // Reset the new task form
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

  const addNewDailyTask = async () => {
    if (!newDailyTask.title.trim() || !newDailyTask.category.trim() || !newDailyTask.goalId.trim()) {
      alert("Please fill in all fields for the daily task.")
      return
    }

    const taskId = crypto.randomUUID()

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

    // Reset the new task form
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

  const toggleWeeklyTaskCompletion = (taskId: string) => {
    const weekKey = `Week ${currentWeek}`

    setWeeklyTasks((prev) => {
      const updatedTasks = (prev[weekKey] || []).map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
      return { ...prev, [weekKey]: updatedTasks }
    })
  }

  const toggleDailyTaskCompletion = (taskId: string) => {
    setDailyTasks((prev) => {
      const updatedTasks = (prev[selectedDay] || []).map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
      return { ...prev, [selectedDay]: updatedTasks }
    })
  }

  const updateWeeklyTask = (taskId: string, updatedTask: Partial<WeeklyTask>) => {
    const weekKey = `Week ${currentWeek}`

    setWeeklyTasks((prev) => {
      const updatedTasks = (prev[weekKey] || []).map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task))
      return { ...prev, [weekKey]: updatedTasks }
    })
  }

  const updateDailyTask = (taskId: string, updatedTask: Partial<DailyTask>) => {
    setDailyTasks((prev) => {
      const updatedTasks = (prev[selectedDay] || []).map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      )
      return { ...prev, [selectedDay]: updatedTasks }
    })
  }

  const deleteWeeklyTask = (taskId: string) => {
    const weekKey = `Week ${currentWeek}`

    setWeeklyTasks((prev) => {
      const updatedTasks = (prev[weekKey] || []).filter((task) => task.id !== taskId)
      return { ...prev, [weekKey]: updatedTasks }
    })
  }

  const deleteDailyTask = (taskId: string) => {
    setDailyTasks((prev) => {
      const updatedTasks = (prev[selectedDay] || []).filter((task) => task.id !== taskId)
      return { ...prev, [selectedDay]: updatedTasks }
    })
  }

  const handleDragEnd: DragEndEvent = (event) => {
    const { active, over } = event

    if (!over) return

    if (active.id === over.id) return

    const weekKey = `Week ${currentWeek}`

    setWeeklyTasks((prev) => {
      const oldIndex = (prev[weekKey] || []).findIndex((task) => task.id === active.id)
      const newIndex = (prev[weekKey] || []).findIndex((task) => task.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return prev

      const updatedTasks = arrayMove(prev[weekKey] || [], oldIndex, newIndex)
      return { ...prev, [weekKey]: updatedTasks }
    })
  }

  const handleDailyDragEnd: DragEndEvent = (event) => {
    const { active, over } = event

    if (!over) return

    if (active.id === over.id) return

    setDailyTasks((prev) => {
      const oldIndex = (prev[selectedDay] || []).findIndex((task) => task.id === active.id)
      const newIndex = (prev[selectedDay] || []).findIndex((task) => task.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return prev

      const updatedTasks = arrayMove(prev[selectedDay] || [], oldIndex, newIndex)
      return { ...prev, [selectedDay]: updatedTasks }
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const loadCategoriesAndGoalsFromDB = async (userId: string) => {
    try {
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name")
        .eq("user_id", userId)

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
        return {}
      }

      const goalsByCategory: GoalsData = {}

      for (const category of categories) {
        const { data: goals, error: goalsError } = await supabase
          .from("goals")
          .select("id, title, description, target_count, current_progress, weekly_target")
          .eq("category_id", category.id)

        if (goalsError) {
          console.error(`Error fetching goals for category ${category.name}:`, goalsError)
          continue
        }

        goalsByCategory[category.name] = goals.map((goal) => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          targetCount: goal.target_count,
          currentCount: goal.current_progress,
          notes: "",
          weeklyTarget: goal.weekly_target,
          category: category.name,
        }))
      }

      return goalsByCategory
    } catch (error) {
      console.error("Error loading data from database:", error)
      return {}
    }
  }

  const loadTasksFromDB = async (userId: string) => {
    try {
      const { data: weeklyTasksData, error: weeklyTasksError } = await supabase
        .from("weekly_tasks")
        .select("id, title, description, category, goal_id, completed, priority, estimated_hours, week")
        .eq("user_id", userId)

      if (weeklyTasksError) {
        console.error("Error fetching weekly tasks:", weeklyTasksError)
      }

      const { data: dailyTasksData, error: dailyTasksError } = await supabase
        .from("daily_tasks")
        .select("id, title, description, category, goal_id, completed, time_block, estimated_minutes, day")
        .eq("user_id", userId)

      if (dailyTasksError) {
        console.error("Error fetching daily tasks:", dailyTasksError)
      }

      const weeklyTasks: Record<string, WeeklyTask[]> = {}
      weeklyTasksData?.forEach((task) => {
        const weekKey = `Week ${task.week}`
        if (!weeklyTasks[weekKey]) {
          weeklyTasks[weekKey] = []
        }
        weeklyTasks[weekKey].push({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category,
          goalId: task.goal_id,
          completed: task.completed,
          priority: task.priority as "low" | "medium" | "high",
          estimatedHours: task.estimated_hours,
        })
      })

      const dailyTasks: Record<string, DailyTask[]> = {}
      dailyTasksData?.forEach((task) => {
        if (!dailyTasks[task.day]) {
          dailyTasks[task.day] = []
        }
        dailyTasks[task.day].push({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category,
          goalId: task.goal_id,
          completed: task.completed,
          timeBlock: task.time_block,
          estimatedMinutes: task.estimated_minutes,
        })
      })

      return { weeklyTasks, dailyTasks }
    } catch (error) {
      console.error("Error loading tasks from database:", error)
      return { weeklyTasks: {}, dailyTasks: {} }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Goal Tracker</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setShowProfile(true)}>
              <Avatar className="mr-2">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              {user?.name || "User Profile"}
            </Button>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily" onClick={() => setActiveView("daily")}>
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" onClick={() => setActiveView("weekly")}>
                Weekly
              </TabsTrigger>
              <TabsTrigger value="quarterly" onClick={() => setActiveView("quarterly")}>
                Quarterly
              </TabsTrigger>
              <TabsTrigger value="longterm" onClick={() => setActiveView("longterm")}>
                Long Term
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Daily Tasks</h2>
                <Button size="sm" onClick={() => setShowAddDailyTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Daily Task
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DndContext id="daily-dnd-context" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDailyDragEnd}>
                <SortableContext id="daily-sortable-context" items={dailyTasks[selectedDay]?.map((task) => task.id) || []} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {(dailyTasks[selectedDay] || []).map((task) => (
                      <SortableDailyTaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => toggleDailyTaskCompletion(task.id)}
                        onEdit={() => setEditingDailyTask(task)}
                        onDelete={() => setShowDeleteDailyTask({ day: selectedDay, taskId: task.id, title: task.title })}
                      />
                    ))}
                    {dailyTasks[selectedDay]?.length === 0 && (
                      <div className="text-gray-500 text-center">No tasks for this day.</div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Weekly Tasks - Week {currentWeek}</h2>
                <Button size="sm" onClick={() => setShowAddWeeklyTask(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Weekly Task
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const newWeek = Math.max(1, currentWeek - 1)
                    setCurrentWeek(newWeek)
                  }}
                  disabled={currentWeek === 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const newWeek = Math.min(12, currentWeek + 1)
                    setCurrentWeek(newWeek)
                  }}
                  disabled={currentWeek === 12}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={weeklyTasks[`Week ${currentWeek}`]?.map((task) => task.id) || []} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
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
                    {weeklyTasks[`Week ${currentWeek}`]?.length === 0 && (
                      <div className="text-gray-500 text-center">No tasks for this week.</div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </TabsContent>

            <TabsContent value="quarterly">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(goalsData).map(([category, goals]) => (
                  <Card key={category}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{category}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedCategory(category)
                            setShowAddGoal(true)
                          }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Goal
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowEditCategory(category)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowDeleteCategory(category)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {goals.map((goal) => (
                          <div key={goal.id} className="border rounded-md p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={goal.currentCount >= goal.targetCount}
                                  onCheckedChange={() => toggleGoalCompletion(goal.id, goal.category)}
                                  className={checkboxStyles}
                                />
                                <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
                              </div>
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
                                  <DropdownMenuItem onClick={() => setShowDeleteGoal({ category, goalId: goal.id, title: goal.title })} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Goal
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="text-gray-500">{goal.description}</CardDescription>
                            <Progress value={(goal.currentCount / goal.targetCount) * 100} className="h-2 mt-2" />
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                              <span>{goal.currentCount} / {goal.targetCount}</span>
                              <span>{((goal.currentCount / goal.targetCount) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="space-x-2">
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
                              </div>
                              {getGoalType(goal.targetCount) !== "binary" && (
                                <Input
                                  type="number"
                                  placeholder="Update Progress"
                                  className="w-24 text-right"
                                  value={goal.currentCount}
                                  onChange={(e) => {
                                    const newValue = Number.parseInt(e.target.value)
                                    if (!isNaN(newValue)) {
                                      updateGoalProgress(category, goal.id, newValue)
                                    }
                                  }}
                                />
                              )}
                            </div>
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setExpandedNotes((prev) => {
                                  const newSet = new Set(prev)
                                  if (newSet.has(goal.id)) {
                                    newSet.delete(goal.id)
                                  } else {
                                    newSet.add(goal.id)
                                  }
                                  return newSet
                                })
                              }}
                            >
                              {expandedNotes.has(goal.id) ? "Hide Notes" : "Show Notes"}
                            </Button>
                            {expandedNotes.has(goal.id) && (
                              <Textarea
                                placeholder="Goal notes..."
                                className="mt-2"
                                value={goal.notes}
                                onChange={(e) => editGoal(category, goal.id, { notes: e.target.value })}
                              />
                            )}
                            <div className="flex justify-between items-center mt-3">
                              <Badge variant="secondary">{goal.weeklyTarget} / Week</Badge>
                              <Badge className={getCategoryColor(goal.category)}>{goal.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed">
                  <CardContent className="grid place-items-center">
                    <Button variant="outline" onClick={() => setShowAddCategory(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="longterm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Long Term Goals</h2>
                <Button size="sm" onClick={() => setShowAddLongTermGoal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Long Term Goal
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as "1-year" | "5-year")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1-Year Goals</SelectItem>
                    <SelectItem value="5-year">5-Year Goals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(longTermGoals[selectedTimeframe]).map(([category, goals]) => (
                  <Card key={category}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{category}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedCategory(category)
                            setShowAddLongTermGoal(true)
                          }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Goal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {goals.map((goal) => (
                          <div key={goal.id} className="border rounded-md p-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditingLongTermGoal({ timeframe: selectedTimeframe, category, goal })}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Goal
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setShowDeleteLongTermGoal({ timeframe: selectedTimeframe, category, goalId: goal.id, title: goal.title })} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Goal
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="text-gray-500">{goal.description}</CardDescription>
                            <div className="mt-2">
                              <Label>Target Date:</Label>
                              <p>{goal.targetDate}</p>
                            </div>
                            <div className="mt-2">
                              <Label>Status:</Label>
                              <Badge>{goal.status}</Badge>
                            </div>
                            <div className="mt-3">
                              <Label>Milestones:</Label>
                              <ul className="list-disc pl-5">
                                {goal.milestones.map((milestone) => (
                                  <li key={milestone.id}>
                                    {milestone.title} - {milestone.completed ? "Completed" : "In Progress"} (Target Date: {milestone.targetDate})
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <Badge className={getCategoryColor(goal.category)}>{goal.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            <DialogDescription>Add a new goal to track your progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} className="col-span-3" />
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
                onChange={(e) => setNewGoal({ ...newGoal, weeklyTarget: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          </div>
          <DialogFooter>
            <Button type="submit" onClick={addNewGoal}>
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddLongTermGoal} onOpenChange={setShowAddLongTermGoal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Long Term Goal</DialogTitle>
            <DialogDescription>Add a new long term goal to track your progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={newLongTermGoal.title} onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, title: e.target.value })} className="col-span-3" />
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
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={newLongTermGoal.category} onValueChange={(value) => setNewLongTermGoal({ ...newLongTermGoal, category: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
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
            {newLongTermGoal.milestones.map((milestone, index) => (
\

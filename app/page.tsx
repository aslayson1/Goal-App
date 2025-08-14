"use client"

// Adding Supabase imports for task persistence
import { createTask as createTaskSupabase } from "@/lib/data/tasks"

import { useState, useEffect } from "react"
import { MoreHorizontal, Edit, Trash2, CheckCircle, Clock, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

// Auth components
import { useAuth } from "@/components/auth/auth-provider"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AuthScreen } from "@/components/auth/auth-screen"
import { SignOutButton } from "@/components/auth/sign-out-button"

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
      description: "Daily goal review and planning",
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

import { getGoals } from "@/lib/data/goals"
import { getCategories, createCategory, type Category } from "@/lib/data/categories"
import { getLongTermGoals } from "@/lib/data/long-term-goals"
import { listTasks } from "@/lib/data/tasks"

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
    goalType: "Business" as "Business" | "Personal" | "Financial",
    milestones: [
      { title: "", targetDate: "", completed: false },
      { title: "", targetDate: "", completed: false },
      { title: "", targetDate: "", completed: false },
      { title: "", targetDate: "", completed: false },
    ],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [dbGoals, setDbGoals] = useState<Goal[]>([])
  const [dbLongTermGoals, setDbLongTermGoals] = useState<LongTermGoal[]>([])
  const [newWeeklyTask, setNewWeeklyTask] = useState({
    title: "",
    description: "",
    category: "",
    goalId: "",
    priority: "medium",
    estimatedHours: 1,
  })
  const [showAddWeeklyTask, setShowAddWeeklyTask] = useState(false)
  const [newDailyTask, setNewDailyTask] = useState({
    title: "",
    description: "",
    goalId: "",
    category: "",
    timeBlock: "",
    estimatedMinutes: 30,
  })
  const [showAddDailyTask, setShowAddDailyTask] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Load categories first
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // Create categories if they don't exist
        const existingCategoryNames = categoriesData.map((c) => c.name)
        const requiredCategories = Object.keys(initialGoalsData)

        for (const categoryName of requiredCategories) {
          if (!existingCategoryNames.includes(categoryName)) {
            await createCategory(categoryName)
          }
        }

        // Load goals and organize by category
        const goalsData = await getGoals()
        setDbGoals(goalsData)

        // Transform database goals to match UI structure
        const organizedGoals: GoalsData = { ...initialGoalsData }
        goalsData.forEach((goal) => {
          const categoryName = categoriesData.find((c) => c.id === goal.category_id)?.name || "General"
          if (!organizedGoals[categoryName]) {
            organizedGoals[categoryName] = []
          }
          organizedGoals[categoryName].push({
            id: goal.id,
            title: goal.title,
            description: goal.description || "",
            targetCount: goal.target_count,
            currentCount: goal.current_progress,
            notes: "",
            weeklyTarget: goal.weekly_target,
            category: "Business",
          })
        })
        setGoalsData(organizedGoals)

        // Load long-term goals
        const longTermGoalsData = await getLongTermGoals()
        setDbLongTermGoals(longTermGoalsData)

        // Transform to UI structure
        const organizedLongTermGoals: LongTermGoalsData = { ...initialLongTermGoals }
        longTermGoalsData.forEach((goal) => {
          const timeframe = goal.goal_type?.includes("1-year") ? "1-year" : "5-year"
          if (!organizedLongTermGoals[timeframe]) {
            organizedLongTermGoals[timeframe] = []
          }
          organizedLongTermGoals[timeframe].push({
            id: goal.id,
            title: goal.title,
            description: goal.description || "",
            goalType: "Business",
            milestones: [
              { title: "Milestone 1", targetDate: "", completed: false },
              { title: "Milestone 2", targetDate: "", completed: false },
              { title: "Milestone 3", targetDate: "", completed: false },
              { title: "Milestone 4", targetDate: "", completed: false },
            ],
          })
        })
        setLongTermGoals(organizedLongTermGoals)

        // Load tasks
        const tasksData = await listTasks()

        // Organize tasks by type and day/week
        const weeklyTasksFromDB: any = {}
        const dailyTasksFromDB: any = {}

        tasksData.forEach((task: any) => {
          const taskObj = {
            id: task.id,
            dbId: task.id, // Store database ID for updates
            title: task.title,
            description: task.description || "",
            completed: task.completed || false,
            goalId: task.goal_id,
            category: categoriesData.find((c) => c.id === task.category_id)?.name || "General",
            priority: "medium" as const,
            estimatedHours: 1,
            timeBlock: "",
            estimatedMinutes: 60,
          }

          if (task.task_type === "weekly") {
            const weekKey = `Week ${currentWeek}`
            if (!weeklyTasksFromDB[weekKey]) {
              weeklyTasksFromDB[weekKey] = []
            }
            weeklyTasksFromDB[weekKey].push(taskObj)
          } else if (task.task_type === "daily") {
            // Determine day based on target_date or default to today
            const targetDate = task.target_date ? new Date(task.target_date) : new Date()
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            const dayName = days[targetDate.getDay()]

            if (!dailyTasksFromDB[dayName]) {
              dailyTasksFromDB[dayName] = []
            }
            dailyTasksFromDB[dayName].push(taskObj)
          }
        })

        // Merge with existing state
        setWeeklyTasks((prev) => ({ ...prev, ...weeklyTasksFromDB }))
        setDailyTasks((prev) => ({ ...prev, ...dailyTasksFromDB }))
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, currentWeek])

  const addWeeklyTask = async () => {
    if (!newWeeklyTask.title.trim()) return

    const taskId = Date.now().toString()
    const weekKey = `Week ${currentWeek}`

    const newTask = {
      id: taskId,
      title: newWeeklyTask.title,
      description: newWeeklyTask.description,
      completed: false,
      goalId: newWeeklyTask.goalId,
      category: newWeeklyTask.category,
      priority: newWeeklyTask.priority as "low" | "medium" | "high",
      estimatedHours: newWeeklyTask.estimatedHours,
    }

    // Optimistic update
    setWeeklyTasks((prev) => ({
      ...prev,
      [weekKey]: [...(prev[weekKey] || []), newTask],
    }))

    try {
      const categoryId = categories.find((c) => c.name === newWeeklyTask.category)?.id || null
      const weekStartDate = new Date()
      weekStartDate.setDate(weekStartDate.getDate() + (currentWeek - 1) * 7)

      const dbTask = await createTaskSupabase({
        title: newWeeklyTask.title,
        description: newWeeklyTask.description || null,
        goal_id: newWeeklyTask.goalId || null,
        target_date: weekStartDate.toISOString().split("T")[0],
        task_type: "weekly",
        category_id: categoryId,
      })

      // Update with database ID
      if (dbTask) {
        setWeeklyTasks((prev) => ({
          ...prev,
          [weekKey]: prev[weekKey]?.map((task) => (task.id === taskId ? { ...task, dbId: dbTask.id } : task)) || [],
        }))
      }
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
    if (!newDailyTask.title.trim()) return

    const taskId = Date.now().toString()
    const newTask = {
      id: taskId,
      title: newDailyTask.title,
      description: newDailyTask.description,
      goalId: newDailyTask.goalId,
      category: newDailyTask.category,
      completed: false,
      timeBlock: newDailyTask.timeBlock,
      estimatedMinutes: newDailyTask.estimatedMinutes,
    }

    // Optimistic update
    setDailyTasks((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newTask],
    }))

    try {
      const categoryId = categories.find((c) => c.name === newDailyTask.category)?.id || null
      const today = new Date()

      const dbTask = await createTaskSupabase({
        title: newDailyTask.title,
        description: newDailyTask.description || null,
        goal_id: newDailyTask.goalId || null,
        target_date: today.toISOString().split("T")[0],
        task_type: "daily",
        category_id: categoryId,
      })

      // Update with database ID
      if (dbTask) {
        setDailyTasks((prev) => ({
          ...prev,
          [selectedDay]:
            prev[selectedDay]?.map((task) => (task.id === taskId ? { ...task, dbId: dbTask.id } : task)) || [],
        }))
      }
    } catch (e) {
      console.error("Supabase create daily task failed:", e)
      // Revert optimistic update on error
      setDailyTasks((prev) => ({
        ...prev,
        [selectedDay]: prev[selectedDay]?.filter((task) => task.id !== taskId) || [],
      }))
    }

    setNewDailyTask({
      title: "",
      description: "",
      goalId: "",
      category: "",
      timeBlock: "",
      estimatedMinutes: 30,
    })
    setShowAddDailyTask(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your goals and tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Goal Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Welcome back, {user?.email}</span>
            <SignOutButton />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: "daily", label: "Daily Tasks" },
            { id: "weekly", label: "Weekly Tasks" },
            { id: "goals", label: "12-Week Goals" },
            { id: "long-term", label: "Long-Term Goals" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daily Tasks View */}
        {activeView === "daily" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Daily Tasks - {selectedDay}</h2>
              <button
                onClick={() => setShowAddDailyTask(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Daily Task
              </button>
            </div>

            <div className="grid gap-4">
              {(dailyTasks[selectedDay] || []).map((task, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        const dayTasks = [...(dailyTasks[selectedDay] || [])]
                        dayTasks[index] = { ...task, completed: !task.completed }
                        setDailyTasks((prev) => ({ ...prev, [selectedDay]: dayTasks }))
                      }}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}
                      >
                        {task.title}
                      </h3>
                      {task.description && <p className="text-sm text-slate-600 mt-1">{task.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Tasks View */}
        {activeView === "weekly" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Weekly Tasks</h2>
              <button
                onClick={() => setShowAddWeeklyTask(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Weekly Task
              </button>
            </div>

            <div className="grid gap-4">
              {weeklyTasks.map((task, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        const updated = [...weeklyTasks]
                        updated[index] = { ...task, completed: !task.completed }
                        setWeeklyTasks(updated)
                      }}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}
                      >
                        {task.title}
                      </h3>
                      {task.description && <p className="text-sm text-slate-600 mt-1">{task.description}</p>}
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>Category: {task.category}</span>
                        <span>Priority: {task.priority}</span>
                        <span>Est: {task.estimatedHours}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals View */}
        {activeView === "goals" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">12-Week Goals</h2>

            <div className="grid gap-6">
              {Object.entries(goalsData).map(([category, goals]) => (
                <div key={category} className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{category}</h3>
                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium text-slate-800">{goal.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-slate-600 mb-1">
                            <span>Progress</span>
                            <span>
                              {goal.currentCount}/{goal.targetCount}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(goal.currentCount / goal.targetCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Long-term Goals View */}
        {activeView === "long-term" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">Long-Term Goals</h2>
              <button
                onClick={() => setShowAddLongTermGoal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Long-Term Goal
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedTimeframe("1-year")}
                className={`px-4 py-2 rounded-lg ${
                  selectedTimeframe === "1-year"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                1-Year Goals
              </button>
              <button
                onClick={() => setSelectedTimeframe("5-year")}
                className={`px-4 py-2 rounded-lg ${
                  selectedTimeframe === "5-year"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                5-Year Goals
              </button>
            </div>

            <div className="grid gap-4">
              {longTermGoals[selectedTimeframe].map((goal, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{goal.title}</h3>
                      <p className="text-slate-600 mt-1">{goal.description}</p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-700">Milestones:</h4>
                    {goal.milestones.map((milestone, mIndex) => (
                      <div key={mIndex} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={() => {
                            const updated = { ...longTermGoals }
                            updated[selectedTimeframe][index].milestones[mIndex].completed = !milestone.completed
                            setLongTermGoals(updated)
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className={milestone.completed ? "line-through text-slate-500" : "text-slate-700"}>
                          {milestone.title}
                        </span>
                        {milestone.targetDate && <span className="text-slate-500">({milestone.targetDate})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return <GoalTrackerApp />
}

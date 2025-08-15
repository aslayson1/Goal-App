"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, CheckCircle, Clock, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

// Auth components
import { useAuth } from "@/components/auth/auth-provider"
import { AuthScreen } from "@/components/auth/auth-screen"
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
  const [currentWeek, setCurrentWeek] = useState(4)
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

  // ... existing code for all the helper functions ...

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

  const toggleDailyTask = (selectedDay: string, taskId: string) => {
    setDailyTasks((prev) => ({
      ...prev,
      [selectedDay]:
        prev[selectedDay]?.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)) || [],
    }))
  }

  const toggleWeeklyTask = (taskId: string) => {
    setWeeklyTasks((prev) => ({
      ...prev,
      [`Week ${currentWeek}`]:
        prev[`Week ${currentWeek}`]?.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ) || [],
    }))
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi Scott,</h1>
            <p className="text-gray-600">Here are your tasks for week {currentWeek} of 12.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowAddGoal(true)} className="bg-black text-white hover:bg-gray-800">
              + Add Goal
            </Button>
            <Button onClick={() => setShowAddCategory(true)} variant="outline">
              + Add Category
            </Button>
            <Button
              onClick={() => setShowProfile(true)}
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full bg-gray-200 p-0"
            >
              {getInitials(user?.user_metadata?.full_name || user?.email)}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900">{getTotalProgress()}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-6 w-6 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {getCompletedTasks()}/{getTotalTasks()}
                </p>
              </div>
              <div className="h-12 w-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <div className="h-6 w-6 bg-cyan-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goals Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {getCompletedGoals()}/{getTotalGoals()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-6 w-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weeks Left</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <div className="h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                <div className="h-6 w-6 bg-teal-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {["daily", "weekly", "12-week", "1-year", "5-year"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === view ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {view === "daily" && "Daily"}
              {view === "weekly" && "Weekly"}
              {view === "12-week" && "12-Week"}
              {view === "1-year" && "1-Year"}
              {view === "5-year" && "5-Year"}
            </button>
          ))}
        </div>

        {/* Daily Tasks View */}
        {activeView === "daily" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daily Tasks</h2>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(goalsData).map((category) => (
                <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                    <Button
                      onClick={() => {
                        setSelectedCategory(category)
                        setNewDailyTask({ ...newDailyTask, category })
                        setShowAddDailyTask(true)
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>

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

                    {(dailyTasks[selectedDay] || []).filter((task) => task.category === category).length === 0 && (
                      <p className="text-gray-500 text-center py-8">Click + to add your first task</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Tasks View */}
        {activeView === "weekly" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Week {currentWeek} Tasks</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(goalsData).map((category) => (
                <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}>
                      {category}
                    </span>
                    <Button
                      onClick={() => {
                        setSelectedCategory(category)
                        setNewWeeklyTask({ ...newWeeklyTask, category })
                        setShowAddWeeklyTask(true)
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>

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

                    {(weeklyTasks[`Week ${currentWeek}`] || []).filter((task) => task.category === category).length ===
                      0 && <p className="text-gray-500 text-center py-8">Click + to add your first task</p>}
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05a7b0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return <GoalTrackerApp />
}

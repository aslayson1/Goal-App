"use client"
// Weekly and cycle recap modals for celebrating user progress
import { supabase } from "@/lib/supabase/client"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { useSearchParams } from "next/navigation"

import Link from "next/link"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DialogTrigger } from "@/components/ui/dialog"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
  Pencil,
  X,
  Menu,
  LayoutDashboard,
  Users,
  Activity,
  Minus,
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
import React from "react" // Ensure React is imported
import { toast } from "@/components/ui/use-toast" // Added for toast notifications
import { Switch } from "@/components/ui/switch" // Import Switch component

// Auth components
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { AuthScreen } from "@/components/auth/auth-screen"
import { UserProfile } from "@/components/profile/user-profile"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

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
      distributeDaily: false, // Added distribution flags
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
      distributeDaily: false,
      distributeWeekly: false,
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
  // Added for database mapping
  linked_goal_id?: string | null
  counter?: number
  target_count?: number | null
  weekly_target?: number | null
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
  target_date?: string // Added for edit functionality and moving tasks
  linked_goal_id?: string | null
  counter?: number // Added for numeric tasks
  target_count?: number | null // Added for numeric tasks
  daily_target?: number | null
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
  // Added distribution toggle fields to Goal interface
  distributeDaily: boolean
  distributeWeekly: boolean
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

// Add after the existing interfaces and before the main component
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
  onUpdateCounter,
}: {
  task: WeeklyTask
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  getPriorityColor: (priority: string) => string
  onUpdateCounter?: (newCount: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Layson Group": "bg-blue-100 text-blue-800",
      Upside: "bg-purple-100 text-purple-800",
      "Family / Relationships": "bg-pink-100 text-pink-800",
      Mortgage: "bg-green-100 text-green-800",
      "Poplar Title": "bg-orange-100 text-orange-800",
      "The Protocol": "bg-yellow-100 text-yellow-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  // Check if this is a numeric task
  const isNumericTask = task.target_count !== null && task.target_count !== undefined && task.target_count > 0
  const currentCount = task.counter || 0
  const targetCount = task.target_count || 0
  const weeklyTarget = task.weekly_target || targetCount
  const progressPercent = targetCount > 0 ? Math.round((currentCount / targetCount) * 100) : 0

  // Calculate increment buttons based on target size
  const getIncrementButtons = () => {
    if (targetCount <= 100) return [1, 5, 10, 25]
    if (targetCount <= 1000) return [1, 10, 50, 100]
    if (targetCount <= 10000) return [1, 100, 1000, 5000]
    return [1, 100, 1000, 5000]
  }

  if (isNumericTask) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`p-3 rounded-lg bg-gray-50 border border-border ${isDragging ? "shadow-lg" : ""}`}
      >
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          {task.completed ? (
            <CheckCircle className="h-4 w-4 text-green-500 cursor-pointer" onClick={onToggle} />
          ) : (
            <Checkbox checked={task.completed} onCheckedChange={onToggle} className={`${checkboxStyles}`} />
          )}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <h3 className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {task.title}
            </h3>
            {task.category && (
              <Badge variant="secondary" className={`text-xs ${getCategoryColor(task.category)}`}>
                {task.category}
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            On Track
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

        {/* Progress counter */}
        <div className="mt-3 flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {currentCount} / {targetCount}
          </span>
          <span className="text-gray-600">{progressPercent}%</span>
        </div>

        {/* Progress bar */}
        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>

        {/* Increment buttons and input */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {getIncrementButtons().map((increment) => (
              <Button
                key={increment}
                variant="outline"
                size="sm"
                className="h-8 px-3 bg-transparent"
                onClick={() => onUpdateCounter?.(currentCount + increment)}
              >
                +{increment >= 1000 ? `${increment / 1000}k` : increment}
              </Button>
            ))}
          </div>
          <Input
            type="number"
            value={currentCount}
            onChange={(e) => onUpdateCounter?.(Number(e.target.value) || 0)}
            className="w-20 h-8 text-center"
          />
        </div>

        {/* Weekly target */}
        <p className="mt-2 text-sm text-gray-500">Weekly target: {weeklyTarget}</p>
      </div>
    )
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
  onUpdateCounter,
  taskId, // taskId will now include the day prefix
}: {
  task: DailyTask
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onUpdateCounter?: (newCount: number) => void
  taskId: string // Changed to string to accommodate the prefixed ID
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: taskId }) // Use taskId here

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Layson Group": "bg-sky-100 text-sky-800 border-sky-200",
      Upside: "bg-violet-100 text-violet-800 border-violet-200",
      "Poplar Title": "bg-purple-100 text-purple-800 border-purple-200",
      "Relationships/Family": "bg-pink-100 text-pink-800 border-pink-200",
      "Family / Relationships": "bg-pink-100 text-pink-800 border-pink-200", // added variant with spaces
      "Physical/Nutrition/Health": "bg-lime-100 text-lime-800 border-lime-200",
      Health: "bg-lime-100 text-lime-800 border-lime-200", // added short form
      "Spiritual/Contribution": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Spiritual / Contribution": "bg-emerald-100 text-emerald-800 border-emerald-200", // added variant with spaces
      "Intellect/Education": "bg-amber-100 text-amber-800 border-amber-200",
      Intellect: "bg-amber-100 text-amber-800 border-amber-200", // added short form
      "Lifestyle/Adventure": "bg-orange-100 text-orange-800 border-orange-200",
      "Personal Finance/Material": "bg-teal-100 text-teal-800 border-teal-200",
      "Personal Finance": "bg-teal-100 text-teal-800 border-teal-200", // added short form
      "Environment / Tribe": "bg-green-100 text-green-800 border-green-200",
      "Personal To-do": "bg-indigo-100 text-indigo-800 border-indigo-200",
      Mortgage: "bg-cyan-100 text-cyan-800 border-cyan-200",
      "The Protocol": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const isNumericTask = task.target_count !== null && task.target_count !== undefined && task.target_count > 0
  const currentCount = task.counter || 0
  const targetCount = task.target_count || 0
  const progressPercentage = targetCount > 0 ? Math.min((currentCount / targetCount) * 100, 100) : 0

  // Calculate quick increment values based on target size
  const getQuickIncrements = (target: number) => {
    if (target <= 10) return [1]
    if (target <= 100) return [1, 5, 10]
    if (target <= 1000) return [1, 10, 50, 100]
    return [1, 100, 1000, 5000]
  }

  const quickIncrements = getQuickIncrements(targetCount)

  if (isNumericTask) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`p-4 rounded-lg border border-gray-200 bg-gray-50 ${isDragging ? "shadow-md" : ""}`}
      >
        {/* Header row with drag handle, checkbox, title, badge, and menu */}
        <div className="flex items-center gap-2 gap-3 mb-3 flex-wrap">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded p-1 flex-shrink-0"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="flex-shrink-0 focus:outline-none"
          >
            {task.completed ? (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <div className="h-5 w-5 border-2 border-gray-300 rounded bg-white flex-shrink-0" />
            )}
          </button>
          {/* Category badge - on mobile appears before title, on desktop hidden here */}
          {task.category && (
            <span
              className={`text-xs px-2 py-0.5 rounded border font-medium flex-shrink-0 sm:hidden ${getCategoryColor(task.category)}`}
            >
              {task.category}
            </span>
          )}
          <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
            <h3 className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {task.title}
            </h3>
            {task.category && (
              <span
                className={`text-xs px-2 py-0.5 rounded border font-medium flex-shrink-0 hidden sm:inline ${getCategoryColor(task.category)}`}
              >
                {task.category}
              </span>
            )}
          </div>
          {/* CHANGE: On Track badge stays on the right */}
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 whitespace-nowrap flex-shrink-0 hidden sm:inline-block">
            On Track
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
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

        {/* Progress section */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {currentCount} / {targetCount}
              </span>
              <span className="font-medium text-gray-900">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 [&>div]:bg-[#05a7b0]" />
          </div>

          {/* Increment buttons and input */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {quickIncrements.map((increment) => (
                <Button
                  key={increment}
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateCounter?.(currentCount + increment)}
                  className="h-7 px-2 text-xs"
                >
                  +{increment >= 1000 ? `${increment / 1000}k` : increment}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={currentCount}
              onChange={(e) => onUpdateCounter?.(Number.parseInt(e.target.value) || 0)}
              className="w-20 h-7 text-xs text-center"
              min="0"
              max={targetCount}
            />
          </div>
        </div>

        {/* Description if exists */}
        {task.description && <p className="text-xs text-gray-500 mt-2">{task.description}</p>}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors ${isDragging ? "bg-gray-100 shadow-md" : "bg-gray-50"}`}
    >
      {/* Task row */}
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          className="flex-shrink-0 focus:outline-none"
        >
          {task.completed ? (
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          ) : (
            <div className="h-5 w-5 border-2 border-gray-300 rounded bg-white flex-shrink-0" />
          )}
        </button>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded p-1 flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0 flex items-start gap-2">
          {task.category && (
            <span
              className={`text-xs px-2 py-0.5 rounded border font-medium flex-shrink-0 self-center ${getCategoryColor(task.category)}`}
            >
              {task.category}
            </span>
          )}
          <h3 className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>{task.title}</h3>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
  )
}

function DroppableDayPlaceholder({ day }: { day: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: day, // Use the day name as the ID for sorting/dropping
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-center h-full text-sm text-muted-foreground py-4 border-2 border-dashed border-gray-200 rounded-lg"
    >
      Drop tasks here for {day}
    </div>
  )
}

function GoalTrackerApp() {
  const { user, isLoading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const selectedAgentId = searchParams.get("agentId") || user?.id

  const [agents, setAgents] = React.useState<Array<{ id: string; name: string }>>([])
  const [selectedAgentName, setSelectedAgentName] = React.useState<string>("")

  const [isLoadingAgentData, setIsLoadingAgentData] = React.useState(false)

  const [goalsData, setGoalsData] = useState<GoalsData>(initialGoalsData)
  console.log("[v0] GoalTrackerApp render - goalsData keys:", Object.keys(goalsData))
  const [oneYearGoalsData, setOneYearGoalsData] = useState<GoalsData>(initialGoalsData)
  console.log("[v0] GoalTrackerApp render - oneYearGoalsData keys:", Object.keys(oneYearGoalsData))
  // The lint error was here: longTermGoals was used before it was declared.
  // It has been moved down to be declared before its first use.
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoalsData>(initialLongTermGoals)
  console.log("[v0] GoalTrackerApp render - longTermGoals 1-year keys:", Object.keys(longTermGoals["1-year"]))
  console.log("[v0] GoalTrackerApp render - longTermGoals 5-year keys:", Object.keys(longTermGoals["5-year"]))
  const [weeklyTasks, setWeeklyTasks] = useState<Record<string, WeeklyTask[]>>({})
  const [dailyTasks, setDailyTasks] = useState<Record<string, DailyTask[]>>({})
  // Separate states for Standard mode tasks (non-12-week)
  const [standardWeeklyTasks, setStandardWeeklyTasks] = useState<Record<string, WeeklyTask[]>>({})
  const [standardDailyTasks, setStandardDailyTasks] = useState<Record<string, DailyTask[]>>({})
  console.log("[v0] GoalTrackerApp render - weeklyTasks keys:", Object.keys(weeklyTasks))
  console.log("[v0] GoalTrackerApp render - dailyTasks keys:", Object.keys(dailyTasks))
  console.log("[v0] GoalTrackerApp render - standardWeeklyTasks keys:", Object.keys(standardWeeklyTasks))
  console.log("[v0] GoalTrackerApp render - standardDailyTasks keys:", Object.keys(standardDailyTasks))

  const [dashboardMode, setDashboardMode] = useState<"12-week" | "standard">("12-week")
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false)
  const [showCycleRecap, setShowCycleRecap] = useState(false)
  const [recapInitialized, setRecapInitialized] = useState(false)
  const [lastShownWeek, setLastShownWeek] = useState(0)
  const [lastShownCycle, setLastShownCycle] = useState(0)
  const [fitnessLogs, setFitnessLogs] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      const prefs = localStorage.getItem(`user_preferences_${user.id}`)
      if (prefs) {
        const preferences = JSON.parse(prefs)
        setDashboardMode(preferences.dashboardMode || "12-week")
      }
    }
  }, [user])

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [activeView, setActiveView] = useState("daily")
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    const calculateWeek = () => {
      // All users use the same calendar-based week system
      // Start from January 1st of the current year
      const today = new Date()
      const year = today.getFullYear()
      const startOfYear = new Date(year, 0, 1) // January 1st
      
      // Calculate which calendar week we're in (1-52)
      const daysDiff = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
      const weekNumber = Math.floor(daysDiff / 7) + 1

      console.log("[v0] calculateWeek - User:", user?.name || "Unknown")
      console.log("[v0] Using calendar-based weeks - Start: Jan 1", year)
      console.log("[v0] Today's date:", today.toDateString())
      console.log("[v0] Days since Jan 1:", daysDiff)
      console.log("[v0] Current calendar week number:", weekNumber)
      
      // For 12-week view: determine which 12-week cycle (1-4)
      // Cycle 1: Weeks 1-13, Cycle 2: Weeks 14-26, Cycle 3: Weeks 27-39, Cycle 4: Weeks 40-52
      const cycleNumber = Math.ceil(weekNumber / 13)
      const weekInCycle = weekNumber - (cycleNumber - 1) * 13
      const displayWeek = Math.min(weekInCycle, 12)
      console.log("[v0] 12-week cycle:", cycleNumber, "week in cycle:", weekInCycle, "display week:", displayWeek)

      setCurrentWeek(displayWeek)
    }

    if (user?.id) {
      calculateWeek()
    }

    // Listen for storage changes (when another tab updates localStorage)
    window.addEventListener("storage", calculateWeek)

    return () => window.removeEventListener("storage", calculateWeek)
  }, [user?.id])

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetCount: 0,
    weeklyTarget: 0,
    distributeDaily: false,
    distributeWeekly: false,
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
  const [showDeleteDailyTask, setShowDeleteDailyTask] = useState<{ day: string; taskId: string; title: string } | null>(
    null,
  )

  const [customCategoryColors, setCustomCategoryColors] = useState<{ [key: string]: string }>({})
  const [showEditCategory, setShowEditCategory] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editCategoryColor, setEditCategoryColor] = useState("")

  const [notesData, setNotesData] = useState<{ [categoryName: string]: Array<{ id: string; content: string; created_at: string }> }>({})
  const [standardNotesData, setStandardNotesData] = useState<{ [categoryName: string]: Array<{ id: string; content: string; created_at: string }> }>({})
  const [newNoteText, setNewNoteText] = useState<{ [categoryName: string]: string }>({})
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

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
      "Family / Relationships": "bg-pink-100 text-pink-800 border-pink-200", // added variant with spaces
      "Physical/Nutrition/Health": "bg-lime-100 text-lime-800 border-lime-200",
      Health: "bg-lime-100 text-lime-800 border-lime-200", // added short form
      "Spiritual/Contribution": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Spiritual / Contribution": "bg-emerald-100 text-emerald-800 border-emerald-200", // added variant with spaces
      "Intellect/Education": "bg-amber-100 text-amber-800 border-amber-200",
      Intellect: "bg-amber-100 text-amber-800 border-amber-200", // added short form
      "Lifestyle/Adventure": "bg-orange-100 text-orange-800 border-orange-200",
      "Personal Finance/Material": "bg-teal-100 text-teal-800 border-teal-200",
      "Personal Finance": "bg-teal-100 text-teal-800 border-teal-200", // added short form
      "Environment / Tribe": "bg-green-100 text-green-800 border-green-200", // added new category variant
      "Personal To-do": "bg-indigo-100 text-indigo-800 border-indigo-200", // added new category variant
      Mortgage: "bg-cyan-100 text-cyan-800 border-cyan-200", // added new category variant
      "The Protocol": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200", // added new category variant
    }

    const additionalColors = [
      "bg-rose-100 text-rose-800 border-rose-200",
      "bg-cyan-100 text-cyan-800 border-cyan-200",
      "bg-emerald-100 text-emerald-800 border-emerald-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-yellow-100 text-yellow-800 border-yellow-200",
      "bg-red-100 text-red-800 border-red-200",
      "bg-sky-100 text-sky-800 border-sky-200",
      "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-violet-100 text-violet-800 border-violet-200",
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
          id: `${currentDayName}_moved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }))

        updated[currentDayName] = [...(prev[currentDayName] || []), ...updatedTasksForToday]

        return updated
      })
    }
  }

  const startNewCycle = async () => {
    const today = new Date()
    const newStartDate = today.toISOString()
    const startDateKey = `goalTracker_startDate_${user?.id || "default"}`

    // Get the old start date to calculate the shift
    const oldStartDateStr = localStorage.getItem(startDateKey)
    const oldStartDate = oldStartDateStr ? new Date(oldStartDateStr) : new Date()

    // Calculate days to shift all weekly tasks
    const daysDifference = Math.floor((today.getTime() - oldStartDate.getTime()) / (1000 * 60 * 60 * 24))

    localStorage.setItem(startDateKey, newStartDate)

    // Reset all goals to 0 progress
    setGoalsData((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((category) => {
        updated[category] = updated[category].map((goal) => ({
          ...goal,
          currentCount: 0,
        }))
      })
      return updated
    })

    // Update current week back to 1
    setCurrentWeek(1)

    await supabase.from("goals").update({ current_progress: 0 }).eq("user_id", selectedAgentId)

    // Reset all tasks to incomplete
    await supabase.from("tasks").update({ completed: false }).eq("user_id", selectedAgentId).eq("completed", true)

    if (daysDifference !== 0) {
      const { data: weeklyTasks } = await supabase
        .from("tasks")
        .select("id, target_date")
        .eq("user_id", selectedAgentId)

      if (weeklyTasks && weeklyTasks.length > 0) {
        for (const task of weeklyTasks) {
          const oldDate = new Date(task.target_date)
          const newDate = new Date(oldDate.getTime() + daysDifference * 24 * 60 * 60 * 1000)
          await supabase
            .from("tasks")
            .update({ target_date: newDate.toISOString().split("T")[0] }) // Only update the date part
            .eq("id", task.id)
        }
      }
    }

    toast({
      title: "New Cycle Started",
      description: "Your 12-week goal cycle has been reset. Good luck!",
    })
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
      if (user?.id && selectedAgentId) {
        setIsLoadingAgentData(true)
        console.log("User authenticated, checking database connection...")
        console.log("[v0] Loading data for agent:", selectedAgentId)

        try {
          // Test database connection
          const { data, error } = await supabase.from("categories").select("count").limit(1)

          if (error) {
            console.error("Database connection failed:", error)
            setIsLoadingAgentData(false)
        } else {
          console.log("Database connection successful!")

            const dbData = await loadCategoriesAndGoalsFromDB(selectedAgentId)
            const oneYearDbData = await loadCategoriesAndOneYearGoalsFromDB(selectedAgentId)
            const taskData = await loadTasksFromDB(selectedAgentId)
            await loadLongTermGoalsFromDB()

            // ADDED: Call autoGenerateDailyTasks here
            await autoGenerateDailyTasks(selectedAgentId, dbData, taskData.dailyTasks)

            try {
              const { data: notesFromDB } = await supabase
                .from("notes")
                .select("id, category_name, content, created_at")
                .eq("user_id", selectedAgentId)
                .order("created_at", { ascending: false })

              if (notesFromDB && notesFromDB.length > 0) {
                const notesMap: { [key: string]: Array<{ id: string; content: string; created_at: string }> } = {}
                const standardNotesMap: { [key: string]: Array<{ id: string; content: string; created_at: string }> } = {}
                
                notesFromDB.forEach((note: { id: string; category_name: string; content: string; created_at: string }) => {
                  // Extract mode from content if stored with delimiter (similar to tasks)
                  let noteMode = "12-week" // default
                  let displayContent = note.content
                  
                  if (note.content?.startsWith("__MODE:")) {
                    const endIndex = note.content.indexOf("__", 7)
                    if (endIndex > 7) {
                      noteMode = note.content.substring(7, endIndex)
                      displayContent = note.content.substring(endIndex + 2)
                    }
                  }
                  
                  // Select appropriate notes map based on mode
                  const targetNotesMap = noteMode === "standard" ? standardNotesMap : notesMap
                  
                  if (!targetNotesMap[note.category_name]) {
                    targetNotesMap[note.category_name] = []
                  }
                  targetNotesMap[note.category_name].push({
                    id: note.id,
                    content: displayContent,
                    created_at: note.created_at,
                  })
                })
                setNotesData(notesMap)
                setStandardNotesData(standardNotesMap)
              }
            } catch (notesError) {
              console.error("Error loading notes:", notesError)
            }

            console.log("=== COMPREHENSIVE TASK LOADING DEBUG ===")
            console.log("Raw task data from database:", JSON.stringify(taskData, null, 2))
            console.log("Daily tasks structure:", JSON.stringify(taskData.dailyTasks, null, 2))
            console.log("Weekly tasks structure:", JSON.stringify(taskData.weeklyTasks, null, 2))

            setGoalsData(dbData)
            setOneYearGoalsData(oneYearDbData)

            console.log("=== FORCING STATE UPDATES ===")

            // Update daily tasks with force re-render
            setDailyTasks(() => {
              console.log("Setting daily tasks to:", JSON.stringify(taskData.dailyTasks, null, 2))
              console.log("Setting standard daily tasks to:", JSON.stringify(taskData.standardDailyTasks, null, 2))
              return { ...taskData.dailyTasks }
            })

            // Update weekly tasks with force re-render
            setWeeklyTasks(() => {
              console.log("Setting weekly tasks to:", JSON.stringify(taskData.weeklyTasks, null, 2))
              console.log("Setting standard weekly tasks to:", JSON.stringify(taskData.standardWeeklyTasks, null, 2))
              return { ...taskData.weeklyTasks }
            })

            setStandardDailyTasks(() => {
              return { ...taskData.standardDailyTasks }
            })

            setStandardWeeklyTasks(() => {
              return { ...taskData.standardWeeklyTasks }
            })

            setIsLoadingAgentData(false)

            setTimeout(() => {
              console.log("=== POST-UPDATE VERIFICATION ===")
              console.log("Daily tasks count:", Object.keys(taskData.dailyTasks).length)
              console.log("Weekly tasks count:", Object.keys(taskData.weeklyTasks).length)
              console.log("State update completed successfully")
            }, 100)
          }
        } catch (error) {
          console.error("Error loading data:", error)
          setIsLoadingAgentData(false)
        }
      }
    }

    checkDatabaseAndLoadData()
  }, [user?.id, selectedAgentId])

  React.useEffect(() => {
    const loadAgents = async () => {
      if (!user?.id) return

      try {
        // Set loading state when starting to load agents
        setIsLoadingAgentData(true)
        const { data: agentsData, error } = await supabase.from("agents").select("id, name").eq("user_id", user.id)

        if (error) throw error

        const agentsList = agentsData || []
        setAgents(agentsList)

        // Find selected agent's name
        const selectedAgent = agentsList.find((a) => a.id === selectedAgentId)
        setSelectedAgentName(selectedAgent?.name || user?.name || "")
      } catch (error) {
        console.error("[v0] Error loading agents:", error)
        setSelectedAgentName(user?.name || "")
      } finally {
        // Clear loading state after loading agents (success or failure)
        setIsLoadingAgentData(false)
      }
    }

    loadAgents()
  }, [user?.id, user?.name, selectedAgentId])

  // Check and show recap modals on first load and when week/cycle changes
  useEffect(() => {
    if (!selectedAgentId || recapInitialized) return

    const today = new Date()
    const year = today.getFullYear()
    const startOfYear = new Date(year, 0, 1)
    const daysDiff = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    const weekNumber = Math.floor(daysDiff / 7) + 1
    const cycleNumber = Math.ceil(weekNumber / 13)

    // Check for weekly recap - show if this week hasn't been shown yet
    const weeklyRecapKey = `lastWeeklyRecap_${selectedAgentId}_week${currentWeek}`
    const hasShownWeekly = localStorage.getItem(weeklyRecapKey)
    if (!hasShownWeekly) {
      setShowWeeklyRecap(true)
      localStorage.setItem(weeklyRecapKey, "true")
      loadWeeklyFitnessActivities()
    }

    // Check for cycle recap - only show at the start of a new cycle
    if (currentWeek % 13 === 1) {
      const cycleRecapKey = `lastCycleRecap_${selectedAgentId}_cycle${cycleNumber}`
      const hasShownCycle = localStorage.getItem(cycleRecapKey)
      if (!hasShownCycle) {
        setShowCycleRecap(true)
        localStorage.setItem(cycleRecapKey, "true")
      }
    }

    setRecapInitialized(true)
  }, [selectedAgentId, currentWeek, recapInitialized])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const incrementGoal = async (category: string, goalId: string, amount = 1) => {
    // Check both goalsData and oneYearGoalsData
    let goal = goalsData[category]?.find((g) => g.id === goalId)
    let isOneYearGoal = false
    
    if (!goal) {
      goal = oneYearGoalsData[category]?.find((g) => g.id === goalId)
      isOneYearGoal = true
    }
    
    if (!goal) return

    const newCount = goal.currentCount + amount

    // Update local state immediately for UI feedback
    if (isOneYearGoal) {
      setOneYearGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((g) => (g.id === goalId ? { ...g, currentCount: newCount } : g)),
      }))
    } else {
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].map((g) => (g.id === goalId ? { ...g, currentCount: newCount } : g)),
      }))
    }

    // Check if this is a database goal (has UUID format) vs local goal
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goalId)

    if (isUUID) {
      try {
        const targetTable = isOneYearGoal ? "long_term_goals" : "goals"
        const { error } = await supabase.from(targetTable).update({ current_progress: newCount }).eq("id", goalId)

        if (error) {
          console.error("Error updating goal progress:", error)
          // Revert local state on error
          if (isOneYearGoal) {
            setOneYearGoalsData((prev) => ({
              ...prev,
              [category]: prev[category].map((g) =>
                g.id === goalId ? { ...g, currentCount: goal!.currentCount } : g,
              ),
            }))
          } else {
            setGoalsData((prev) => ({
              ...prev,
              [category]: prev[category].map((g) =>
                g.id === goalId ? { ...g, currentCount: goal!.currentCount } : g,
              ),
            }))
          }
        }
      } catch (error) {
        console.error("Error updating goal progress:", error)
      }
    }
  }

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    // Find the category of the goal first
    let goalCategory = ""
    let goalToUpdate: Goal | undefined

    for (const [category, goals] of Object.entries(goalsData)) {
      const foundGoal = goals.find((g) => g.id === goalId)
      if (foundGoal) {
        goalCategory = category
        goalToUpdate = foundGoal
        break
      }
    }

    if (!goalToUpdate || !goalCategory) return

    const clampedValue = Math.min(Math.max(newValue, 0), goalToUpdate.targetCount)

    // Update local state immediately for UI feedback
    setGoalsData((prev) => ({
      ...prev,
      [goalCategory]: prev[goalCategory].map((goal) =>
        goal.id === goalId ? { ...goal, currentCount: clampedValue } : goal,
      ),
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
            [goalCategory]: prev[goalCategory].map((goal) =>
              goal.id === goalId ? { ...goal, currentCount: goalToUpdate.currentCount } : goal,
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
    if (targetCount <= 100) return "small"
    if (targetCount <= 1000) return "medium"
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

    if (!selectedCategory || !newGoal.title) {
      console.log("[v0] addNewGoal validation failed - selectedCategory:", selectedCategory, "title:", newGoal.title)
      return
    }

    console.log("[v0] addNewGoal starting - mode:", dashboardMode, "category:", selectedCategory, "title:", newGoal.title)

    const goalId = crypto.randomUUID()

    const weeklyTargetValue = newGoal.weeklyTarget || Math.ceil(targetCount / 12)

    // Update local state based on dashboard mode
    const goalObject = {
      id: goalId,
      title: newGoal.title,
      description: newGoal.description,
      targetCount: targetCount,
      currentCount: 0,
      notes: "",
      weeklyTarget: weeklyTargetValue,
      category: selectedCategory,
      // Set distribution flags from newGoal state
      distributeDaily: newGoal.distributeDaily,
      distributeWeekly: newGoal.distributeWeekly,
    }

    if (dashboardMode === "12-week") {
      setGoalsData((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], goalObject],
      }))
      console.log("[v0] Added goal to goalsData")
    } else {
      setOneYearGoalsData((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], goalObject],
      }))
      console.log("[v0] Added goal to oneYearGoalsData")
    }

    try {
      if (!user?.id) {
        console.error("User not authenticated")
        return
      }

      let { data: categories } = await supabase
        .from("categories")
        .select("id")
        .eq("name", selectedCategory)
        .eq("user_id", user.id)
        .single()

      // If category doesn't exist, create it
      if (!categories) {
        const categoryId = crypto.randomUUID()
        const { error: categoryError } = await supabase.from("categories").insert({
          id: categoryId,
          user_id: user.id,
          name: selectedCategory,
        })

        if (categoryError) {
          console.error("Error creating category in database:", categoryError)
          return
        }

        // Set the category data for the goal insert
        categories = { id: categoryId }
        console.log("Category created in database successfully")
      }

      const { error } = await supabase.from(dashboardMode === "12-week" ? "goals" : "long_term_goals").insert({
        id: goalId,
        user_id: user.id,
        ...(dashboardMode === "12-week" && { category_id: categories.id }),
        title: newGoal.title,
        description: dashboardMode === "standard" ? `__CATEGORY:${selectedCategory}__${newGoal.description}` : newGoal.description,
        target_count: targetCount,
        current_progress: 0,
        weekly_target: weeklyTargetValue,
        ...(dashboardMode === "12-week" && {
          distribute_daily: newGoal.distributeDaily,
          distribute_weekly: newGoal.distributeWeekly,
        }),
        daily_target: Math.ceil(targetCount / 84), // Calculate daily target (12 weeks * 7 days)
        ...(dashboardMode === "standard" && { goal_type: "1_year" }), // Add goal_type for 1-year goals
      })

      if (error) {
        console.error("Error saving goal to database:", error)
      } else {
        console.log("Goal saved to database successfully")

        if (targetCount > 0 && (newGoal.distributeDaily || newGoal.distributeWeekly)) {
          const dailyTarget = Math.ceil(targetCount / 84) // 12 weeks * 7 days
          const weeklyTarget = Math.ceil(targetCount / 12)

          // Create daily task if daily distribution is enabled
          if (newGoal.distributeDaily) {
            const today = new Date()
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
            const dailyTaskId = crypto.randomUUID()

            const dailyTask: DailyTask = {
              id: dailyTaskId,
              title: newGoal.title,
              description: `Daily target: ${dailyTarget}`,
              category: selectedCategory,
              goalId: goalId,
              completed: false,
              timeBlock: "",
              estimatedMinutes: 0,
              target_date: todayStr,
              linked_goal_id: goalId,
              counter: 0,
              target_count: targetCount,
              daily_target: dailyTarget,
            }

            // Add to local state
            const dayName = today.toLocaleDateString("en-US", { weekday: "long" })
            setDailyTasks((prev) => ({
              ...prev,
              [dayName]: [...(prev[dayName] || []), dailyTask],
            }))

            // Save to database
            const { error: dailyTaskError } = await supabase.from("tasks").insert({
              id: dailyTaskId,
              user_id: user.id,
              title: newGoal.title,
              description: `__MODE:${dashboardMode}__Daily target: ${dailyTarget}`,
              category_id: categories.id,
              task_type: "daily",
              target_date: todayStr,
              linked_goal_id: goalId,
              counter: 0,
              target_count: targetCount,
              daily_target: dailyTarget, // Note: This likely intended to be weekly_target or similar if DB schema differs, but following prompt exactly.
              completed: false,
            })

            if (dailyTaskError) {
              console.error("Error creating daily task:", dailyTaskError)
            } else {
              console.log("Daily task created successfully")
            }
          }

          // Create weekly task if weekly distribution is enabled
          if (newGoal.distributeWeekly) {
            const today = new Date()
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
            const weeklyTaskId = crypto.randomUUID()

            // Add to weekly tasks local state
            const newWeeklyTask = {
              id: weeklyTaskId,
              title: newGoal.title,
              description: `Weekly target: ${weeklyTarget}`,
              category: selectedCategory,
              completed: false,
              linked_goal_id: goalId,
              counter: 0,
              target_count: targetCount,
              weekly_target: weeklyTarget,
            }

            const weekKey = `Week ${currentWeek}`
            setWeeklyTasks((prev) => ({
              ...prev,
              [weekKey]: [...(prev[weekKey] || []), newWeeklyTask],
            }))

            // Save to database
            const { error: weeklyTaskError } = await supabase.from("tasks").insert({
              id: weeklyTaskId,
              user_id: user.id,
              title: newGoal.title,
              description: `__MODE:${dashboardMode}__Weekly target: ${weeklyTarget}`,
              category_id: categories.id,
              task_type: "weekly",
              target_date: todayStr,
              linked_goal_id: goalId,
              counter: 0,
              target_count: targetCount,
              weekly_target: weeklyTarget,
              completed: false,
            })

            if (weeklyTaskError) {
              console.error("Error creating weekly task:", weeklyTaskError)
            } else {
              console.log("[v0] Weekly task created successfully for", weekKey)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error saving goal:", error)
    }

    setNewGoal({
      title: "",
      description: "",
      targetCount: 0,
      weeklyTarget: 0,
      distributeDaily: false,
      distributeWeekly: false,
    })
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
      const targetTable = dashboardMode === "12-week" ? "goals" : "long_term_goals"
      await supabase.from(targetTable).delete().eq("id", goalId)
      
      if (dashboardMode === "12-week") {
        setGoalsData((prev) => ({
          ...prev,
          [category]: prev[category].filter((goal) => goal.id !== goalId),
        }))
      } else {
        setOneYearGoalsData((prev) => ({
          ...prev,
          [category]: prev[category].filter((goal) => goal.id !== goalId),
        }))
      }
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
        const targetTable = dashboardMode === "12-week" ? "goals" : "long_term_goals"
        const updateData: Record<string, any> = {
          title: newGoal.title,
          description: newGoal.description,
          target_count: newGoal.targetCount,
          weekly_target: weeklyTargetValue,
          updated_at: new Date().toISOString(),
        }

        // Only add distribution flags for 12-week goals
        if (dashboardMode === "12-week") {
          updateData.distribute_daily = newGoal.distributeDaily
          updateData.distribute_weekly = newGoal.distributeWeekly
        }

        const { error } = await supabase.from(targetTable).update(updateData).eq("id", editingGoal.goal.id)

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
      // Update distribution flags in local state
      distributeDaily: newGoal.distributeDaily,
      distributeWeekly: newGoal.distributeWeekly,
    })

    setNewGoal({
      title: "",
      description: "",
      targetCount: 0,
      weeklyTarget: 0,
      distributeDaily: false,
      distributeWeekly: false,
    })
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
      // Populate distribution flags for editing
      distributeDaily: goal.distributeDaily,
      distributeWeekly: goal.distributeWeekly,
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

  const saveEditedDailyTask = async () => {
    if (!editingDailyTask) return

    try {
      if (!user?.id) {
        console.error("[v0] No user ID available for updating task")
        return
      }

      // Look up category ID if category is provided
      let categoryId = null
      if (newDailyTask.category) {
        const { data: categories } = await supabase
          .from("categories")
          .select("id")
          .eq("name", newDailyTask.category)
          .eq("user_id", user.id)
          .single()

        categoryId = categories?.id || null
      }

      const { error } = await supabase
        .from("tasks")
        .update({
          title: newDailyTask.title,
          description: newDailyTask.description,
          category_id: categoryId,
          goal_id: newDailyTask.goalId || null,
          time_block: newDailyTask.timeBlock || null,
          estimated_minutes: newDailyTask.estimatedMinutes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingDailyTask.id)
        .eq("user_id", user.id)

      if (error) {
        console.error("[v0] Error updating task:", error)
      } else {
        console.log("[v0] Task updated successfully in database")

        const taskDate = new Date(editingDailyTask.target_date)
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const dayName = daysOfWeek[taskDate.getDay()]

        editDailyTask(dayName, editingDailyTask.id, {
          title: newDailyTask.title,
          description: newDailyTask.description,
          category: newDailyTask.category,
          goalId: newDailyTask.goalId,
          timeBlock: newDailyTask.timeBlock,
          estimatedMinutes: newDailyTask.estimatedMinutes,
        })
      }
    } catch (error) {
      console.error("[v0] Error in saveEditedDailyTask:", error)
    } finally {
      setEditingDailyTask(null)
      setShowAddDailyTask(false)
      setNewDailyTask({
        title: "",
        description: "",
        category: "",
        goalId: "",
        timeBlock: "", // Resetting as it's removed
        estimatedMinutes: 30, // Resetting as it's removed
      })
    }
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
      const { data: categories } = await supabase
        .from("categories")
        .select("id")
        .eq("name", oldCategoryName)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)

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

      if (categories && categories.length > 0) {
        // Delete from database first
        const { error } = await supabase.from("categories").delete().eq("id", categories[0].id)
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
        return {}
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
        return {}
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
          // Load distribution flags from database
          distributeDaily: goal.distribute_daily || false,
          distributeWeekly: goal.distribute_weekly || false,
        })
      })

      if (Object.keys(groupedGoals).length === 0) {
        console.log("[v0] No categories found in database")
        return {}
      }

      return groupedGoals
    } catch (error) {
      console.error("Error loading data from database:", error)
      return {}
    }
  }

  const loadCategoriesAndOneYearGoalsFromDB = async (userId: string) => {
    try {
      // Load all categories for this user
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
        return {}
      }

      const { data: goals, error: goalsError } = await supabase
        .from("long_term_goals")
        .select("*")
        .eq("user_id", userId)
        .eq("goal_type", "1_year")

      if (goalsError) {
        console.error("Error fetching 1-year goals:", goalsError)
        return {}
      }

      // Group goals by category - initialize with all categories
      const groupedGoals: GoalsData = {}
      categories.forEach((category) => {
        groupedGoals[category.name] = []
      })

      // Add 1-year goals to their categories
      goals.forEach((goal) => {
        // Extract category from description if it's stored with our delimiter
        let categoryName = categories.length > 0 ? categories[0].name : "Uncategorized"
        let displayDescription = goal.description || ""
        
        if (goal.description?.startsWith("__CATEGORY:")) {
          // Find the closing delimiter: __CATEGORY:CategoryName__Description
          const secondDelimiterIndex = goal.description.indexOf("__", 11)
          if (secondDelimiterIndex > 11) {
            categoryName = goal.description.substring(11, secondDelimiterIndex)
            displayDescription = goal.description.substring(secondDelimiterIndex + 2)
          }
        }
        
        // Ensure category exists in groupedGoals
        if (!groupedGoals[categoryName]) {
          groupedGoals[categoryName] = []
        }
        
        groupedGoals[categoryName].push({
          id: goal.id,
          title: goal.title,
          description: displayDescription,
          targetCount: goal.target_count || 1,
          currentCount: goal.current_progress || 0,
          notes: goal.notes || "",
          weeklyTarget: goal.weekly_target || 1,
          category: categoryName,
          // 1-year goals don't have distribution flags
          distributeDaily: false,
          distributeWeekly: false,
        })
      })

      if (goals.length === 0) {
        console.log("[v0] No 1-year goals found in database")
      }

      return groupedGoals
    } catch (error) {
      console.error("Error loading 1-year goals from database:", error)
      return {}
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
  }

  const addLongTermGoal = async () => {
    if (!newLongTermGoal.title || !user?.id) return

    try {
      const goalType = selectedTimeframe === "1-year" ? "1_year" : "5_year"

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
    const goalPercentages: number[] = []
    
    // Select appropriate goals data based on dashboard mode
    const targetGoalsData = dashboardMode === "standard" ? oneYearGoalsData : goalsData

    // Calculate progress for goals
    Object.values(targetGoalsData).forEach((goals) => {
      goals.forEach((goal) => {
        const percentage = goal.targetCount === 0 ? 0 : (goal.currentCount / goal.targetCount) * 100
        goalPercentages.push(percentage)
      })
    })

    if (dashboardMode === "standard") {
      // Calculate progress for long-term goals (1-year and 5-year)
      Object.values(longTermGoals).forEach((timeframeGoals) => {
        Object.values(timeframeGoals).forEach((goals) => {
          goals.forEach((goal) => {
            if (goal.status === "completed") {
              goalPercentages.push(100)
            } else if (goal.milestones && goal.milestones.length > 0) {
              const completedMilestones = goal.milestones.filter((m) => m.completed).length
              const percentage = (completedMilestones / goal.milestones.length) * 100
              goalPercentages.push(percentage)
            } else {
              goalPercentages.push(0)
            }
          })
        })
      })
    }

    const totalPercentage = goalPercentages.reduce((sum, p) => sum + p, 0)
    const averagePercentage = goalPercentages.length === 0 ? 0 : totalPercentage / goalPercentages.length
    return Math.round(averagePercentage)
  }

  const getTotalTasks = () => {
    let totalTasks = 0
    // Only count daily tasks, not weekly tasks (weekly are considered goals)
    const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
    
    Object.values(targetDailyTasks).forEach((tasks) => {
      totalTasks += tasks.length
    })
    return totalTasks
  }

  const getCompletedTasks = () => {
    let completedTasks = 0
    // Only count daily tasks, not weekly tasks (weekly are considered goals)
    const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
    
    Object.values(targetDailyTasks).forEach((tasks) => {
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
    // Select appropriate goals data based on dashboard mode
    const targetGoalsData = dashboardMode === "standard" ? oneYearGoalsData : goalsData
    const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
    
    // Count numeric goals
    Object.values(targetGoalsData).forEach((goals) => {
      totalGoals += goals.length
    })

    // Count weekly goals (weekly tasks are actually goals)
    Object.values(targetWeeklyTasks).forEach((goals) => {
      totalGoals += goals.length
    })

    // Only add 1-year long-term goals in standard dashboard mode (not 5-year)
    if (dashboardMode === "standard") {
      const oneYearLongTermGoals = longTermGoals["1_year"] || {}
      Object.values(oneYearLongTermGoals).forEach((goals) => {
        totalGoals += goals.length
      })
    }

    return totalGoals
  }

  const getCompletedGoals = () => {
    let completedGoals = 0
    // Select appropriate goals data based on dashboard mode
    const targetGoalsData = dashboardMode === "standard" ? oneYearGoalsData : goalsData
    const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
    
    // Count completed numeric goals
    Object.values(targetGoalsData).forEach((goals) => {
      goals.forEach((goal) => {
        if (goal.currentCount >= goal.targetCount) {
          completedGoals++
        }
      })
    })

    // Count completed weekly goals (weekly tasks are actually goals)
    Object.values(targetWeeklyTasks).forEach((goals) => {
      goals.forEach((goal) => {
        if (goal.completed) {
          completedGoals++
        }
      })
    })

    // Only count completed 1-year long-term goals in standard dashboard mode
    if (dashboardMode === "standard") {
      const oneYearLongTermGoals = longTermGoals["1_year"] || {}
      Object.values(oneYearLongTermGoals).forEach((goals) => {
        goals.forEach((goal) => {
          if (goal.status === "completed") {
            completedGoals++
          }
        })
      })
    }

    return completedGoals
  }

  const getProgressPercentage = (current: number, target: number) => {
    return target === 0 ? 0 : (current / target) * 100
  }

  const getWeeklyProgress = (goal: Goal) => {
    const weeklyTarget = goal.weeklyTarget || Math.ceil(goal.targetCount / 12)
    const expectedProgress = weeklyTarget * (currentWeek - 1)
    const onTrack = goal.currentCount >= expectedProgress
    return { weeklyTarget, expectedProgress, onTrack }
  }

  // Load fitness activities for the current week
  const loadWeeklyFitnessActivities = async () => {
    if (!user?.id) return

    const today = new Date()
    const year = today.getFullYear()
    const startOfYear = new Date(year, 0, 1)
    const daysDiff = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    const currentWeekNumber = Math.floor(daysDiff / 7) + 1

    // Calculate week start and end dates
    const weekStart = new Date(startOfYear)
    weekStart.setDate(startOfYear.getDate() + (currentWeekNumber - 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    try {
      const { data } = await supabase
        .from('fitness_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_date', weekStart.toISOString().split('T')[0])
        .lte('logged_date', weekEnd.toISOString().split('T')[0])
        .order('logged_date', { ascending: false })

      if (data) {
        setFitnessLogs(data)
      }
    } catch (error) {
      console.error('[v0] Error loading weekly fitness activities:', error)
    }
  }

  // Get fitness metrics for weekly recap
  const getWeeklyFitnessMetrics = () => {
    const activities = fitnessLogs || []
    
    if (activities.length === 0) {
      return null
    }

    // Count active days (unique dates with activities)
    const activeDays = new Set(activities.map(a => a.logged_date)).size

    // Calculate longest streak (consecutive days)
    let longestStreak = 0
    let currentStreak = 1
    
    if (activities.length > 0) {
      const sortedDates = activities
        .map(a => new Date(a.logged_date).getTime())
        .sort((a, b) => a - b)
      
      for (let i = 1; i < sortedDates.length; i++) {
        const dayDiff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24)
        if (dayDiff === 1) {
          currentStreak++
          longestStreak = Math.max(longestStreak, currentStreak)
        } else {
          currentStreak = 1
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak)
    }

    // Current ranking (this would come from leaderboard data in a real scenario)
    // For now, we'll show a placeholder - this could be enhanced with actual leaderboard data
    const currentRanking = "#" + Math.floor(Math.random() * 100 + 1)

    return {
      activeDays,
      longestStreak,
      currentRanking,
    }
  }

  // Calculate metrics for weekly recap
  const getWeeklyRecapData = () => {
    const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
    const targetGoalsData = dashboardMode === "standard" ? oneYearGoalsData : goalsData

    // Get current week's tasks and weekly goals
    const currentWeekKey = `Week ${currentWeek}`
    const currentWeekTasks = targetWeeklyTasks[currentWeekKey] || []
    const completedWeeklyTasks = currentWeekTasks.filter((t) => t.completed).length

    // Calculate weekly goals completion
    const allWeeklyGoals = Object.values(targetGoalsData).flat()
    const completedWeeklyGoals = allWeeklyGoals.filter((g) => g.currentCount >= g.targetCount).length

    // Calculate streak (consecutive completed weeks)
    let streak = 0
    for (let i = currentWeek - 1; i > 0; i--) {
      const weekKey = `Week ${i}`
      const weekTasks = targetWeeklyTasks[weekKey] || []
      const allCompleted = weekTasks.every((t) => t.completed)
      if (allCompleted && weekTasks.length > 0) {
        streak++
      } else {
        break
      }
    }

    return {
      completedTasks: completedWeeklyTasks,
      totalTasks: currentWeekTasks.length,
      completedGoals: completedWeeklyGoals,
      totalGoals: allWeeklyGoals.length,
      streak,
      weeklyProgress: currentWeekTasks.length > 0 ? (completedWeeklyTasks / currentWeekTasks.length) * 100 : 0,
    }
  }

  // Calculate metrics for cycle recap
  const getCycleRecapData = () => {
    const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
    const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
    const targetGoalsData = dashboardMode === "standard" ? oneYearGoalsData : goalsData

    let totalCompletedTasks = 0
    let totalTasks = 0

    // Count all tasks in the current cycle
    if (dashboardMode === "12-week") {
      const cycleNumber = Math.ceil(currentWeek / 13) || 1
      const cycleStart = (cycleNumber - 1) * 13 + 1
      const cycleEnd = Math.min(cycleNumber * 13, 12)

      for (let week = cycleStart; week <= cycleEnd; week++) {
        const weekKey = `Week ${week}`
        const weekTasks = targetWeeklyTasks[weekKey] || []
        totalTasks += weekTasks.length
        totalCompletedTasks += weekTasks.filter((t) => t.completed).length
      }

      // Add daily tasks
      Object.values(targetDailyTasks).forEach((tasks) => {
        totalTasks += tasks.length
        totalCompletedTasks += tasks.filter((t) => t.completed).length
      })
    } else {
      // Standard mode: all weeks
      Object.values(targetWeeklyTasks).forEach((tasks) => {
        totalTasks += tasks.length
        totalCompletedTasks += tasks.filter((t) => t.completed).length
      })
      Object.values(targetDailyTasks).forEach((tasks) => {
        totalTasks += tasks.length
        totalCompletedTasks += tasks.filter((t) => t.completed).length
      })
    }

    // Count completed goals
    const allGoals = Object.values(targetGoalsData).flat()
    const completedGoals = allGoals.filter((g) => g.currentCount >= g.targetCount).length
    const totalGoals = allGoals.length

    return {
      completedTasks: totalCompletedTasks,
      totalTasks,
      completedGoals,
      totalGoals,
      cycleProgress: totalTasks > 0 ? (totalCompletedTasks / totalTasks) * 100 : 0,
      bestWeek: Math.ceil(currentWeek / 13), // Could be enhanced to find actual best week
    }
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

  const getDateForDay = (dayName: string): string => {
    const today = new Date()
    const currentDay = today.getDay()
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const targetDayIndex = daysOfWeek.indexOf(dayName)

    const daysToAdd = (targetDayIndex - currentDay + 7) % 7
    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() + daysToAdd)

    return targetDate.toISOString().split("T")[0]
  }

  const handleDailyTaskDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const activeTaskId = String(active.id)
    const overTaskId = String(over.id)

    // Day names for reference
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    // Check if over.id is just a day name (empty day drop target)
    const isOverDayOnly = daysOfWeek.includes(overTaskId)

    let activeDay: string
    let overDay: string
    let activeId: string

    // Parse active task info (always prefixed with day name)
    const activeDayMatch = daysOfWeek.find((d) => activeTaskId.startsWith(d + "-"))
    if (activeDayMatch) {
      activeDay = activeDayMatch
      activeId = activeTaskId.substring(activeDay.length + 1)
    } else {
      return // Invalid active ID
    }

    // Parse over target info
    if (isOverDayOnly) {
      // Dropping onto an empty day placeholder
      overDay = overTaskId
    } else {
      // Dropping onto another task
      const overDayMatch = daysOfWeek.find((d) => overTaskId.startsWith(d + "-"))
      if (overDayMatch) {
        overDay = overDayMatch
      } else {
        return // Invalid over ID
      }
    }

    // Find the task
    const taskToMove = dailyTasks[activeDay]?.find((t) => t.id === activeId)
    if (!taskToMove) return

    // If dragging within the same day, just reorder
    if (activeDay === overDay && !isOverDayOnly) {
      const overId = overTaskId.substring(overDay.length + 1)
      setDailyTasks((prev) => {
        const oldIndex = prev[activeDay]?.findIndex((task) => task.id === activeId) ?? -1
        const newIndex = prev[activeDay]?.findIndex((task) => task.id === overId) ?? -1

        if (oldIndex === -1 || newIndex === -1) return prev

        const newItems = arrayMove(prev[activeDay], oldIndex, newIndex)

        const updates = newItems.map((task, index) => ({
          id: task.id,
          sort_order: index,
        }))

        // Update database with new sort order
        Promise.all(
          updates.map((update) => supabase.from("tasks").update({ sort_order: update.sort_order }).eq("id", update.id)),
        ).catch((error) => {
          console.error("[v0] Error updating task order:", error)
        })

        return {
          ...prev,
          [activeDay]: newItems,
        }
      })
    } else {
      // Moving to a different day
      const targetDate = getDateForDay(overDay)

      setDailyTasks((prev) => {
        // Remove from source day
        const sourceDay = prev[activeDay]?.filter((task) => task.id !== activeId) || []

        // Add to target day (at the end for empty days, or at the position of the target task)
        const targetDayTasks = [...(prev[overDay] || [])]

        if (isOverDayOnly) {
          // Dropping onto empty day - add at the end
          const movedTask = { ...taskToMove, target_date: targetDate }
          targetDayTasks.push(movedTask)
        } else {
          // Dropping onto another task - insert at that position
          const overId = overTaskId.substring(overDay.length + 1)
          const overIndex = targetDayTasks.findIndex((task) => task.id === overId)
          const insertIndex = overIndex >= 0 ? overIndex : targetDayTasks.length
          const movedTask = { ...taskToMove, target_date: targetDate }
          targetDayTasks.splice(insertIndex, 0, movedTask)
        }

        return {
          ...prev,
          [activeDay]: sourceDay,
          [overDay]: targetDayTasks,
        }
      })

      // Update database
      try {
        await supabase.from("tasks").update({ target_date: targetDate }).eq("id", activeId)
      } catch (error) {
        console.error("[v0] Error moving task to different day:", error)
      }
    }
  }

  const toggleDailyTask = async (selectedDay: string, taskId: string) => {
    console.log("[v0] toggleDailyTask called - day:", selectedDay, "taskId:", taskId, "dashboardMode:", dashboardMode)
    
    // Use appropriate state based on dashboard mode
    const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
    const setTargetDailyTasks = dashboardMode === "standard" ? setStandardDailyTasks : setDailyTasks
    
    // Find the current task to get its completion status
    const currentTask = targetDailyTasks[selectedDay]?.find((task) => task.id === taskId)
    if (!currentTask) {
      console.log("[v0] Task not found in:", selectedDay)
      return
    }

    const newCompletedStatus = !currentTask.completed
    console.log("[v0] Toggling task completion from", currentTask.completed, 'to', newCompletedStatus)

    // Update local state immediately for UI feedback
    setTargetDailyTasks((prev) => ({
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
        setTargetDailyTasks((prev) => ({
          ...prev,
          [selectedDay]:
            prev[selectedDay]?.map((task) =>
              task.id === taskId ? { ...task, completed: currentTask.completed } : task,
            ) || [],
        }))
      } else {
        console.log("[v0] Task completion updated successfully")
      }
    } catch (error) {
      console.error("Error updating task completion:", error)
    }
  }

  const addDailyTask = async () => {
    console.log("[v0] addDailyTask called")
    console.log("[v0] newDailyTask:", newDailyTask)
    console.log("[v0] selectedDay:", selectedDay)
    console.log("[v0] Dashboard mode:", dashboardMode)
    console.log("[v0] user:", user)

    if (!newDailyTask.title) {
      console.log("[v0] No title provided, returning")
      return
    }

    const taskId = crypto.randomUUID()
    console.log("[v0] Generated task ID:", taskId)

    const taskData = {
      title: newDailyTask.title,
      description: newDailyTask.description,
      category: newDailyTask.category,
      goalId: newDailyTask.goalId,
      // Removed timeBlock and estimatedMinutes as per the update
    }

    console.log("[v0] Task data prepared:", taskData)

    // Use appropriate state based on dashboard mode
    const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
    const setTargetDailyTasks = dashboardMode === "standard" ? setStandardDailyTasks : setDailyTasks

    setTargetDailyTasks((prev) => ({
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
          // Removed timeBlock and estimatedMinutes from local state update
        },
      ],
    }))

    console.log("[v0] Task added to local state for day:", selectedDay, "mode:", dashboardMode)

    setNewDailyTask({
      title: "",
      description: "",
      category: "",
      goalId: "",
      timeBlock: "", // Resetting as it's removed
      estimatedMinutes: 30, // Resetting as it's removed
    })
    setShowAddDailyTask(false)

    try {
      if (!user?.id) {
        console.error("[v0] ERROR: No user ID available - task will not be saved to database!")
        console.error("[v0] User object:", user)
        return
      }

      console.log("[v0] User authenticated, proceeding with database save")
      console.log("[v0] User ID:", user.id)

      // Look up category ID if category is provided
      let categoryId = null
      if (taskData.category) {
        console.log("[v0] Looking up category ID for:", taskData.category)
        const { data: categories } = await supabase
          .from("categories")
          .select("id")
          .eq("name", taskData.category)
          .eq("user_id", user.id)
          .single()

        categoryId = categories?.id || null
        console.log("[v0] Category ID found:", categoryId)
      }

      // Calculate the target_date based on the selected day
      const today = new Date()
      const currentDayIndex = today.getDay()
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const selectedDayIndex = daysOfWeek.indexOf(selectedDay)

      console.log("[v0] Date calculation:")
      console.log("[v0]   - Today:", today.toISOString())
      console.log("[v0]   - Current day index:", currentDayIndex)
      console.log("[v0]   - Selected day:", selectedDay)
      console.log("[v0]   - Selected day index:", selectedDayIndex)

      // Calculate days difference
      let daysDiff = selectedDayIndex - currentDayIndex

      // If the selected day is in the past this week, move to next week
      if (daysDiff < 0) {
        daysDiff += 7
      }

      console.log("[v0]   - Days difference:", daysDiff)

      // Create target date
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() + daysDiff)

      console.log("[v0]   - Target date:", targetDate.toISOString())
      console.log("[v0]   - Target date (formatted):", targetDate.toISOString().split("T")[0])

      const insertData = {
        id: taskId,
        user_id: user.id,
        category_id: categoryId,
        goal_id: taskData.goalId || null,
        title: taskData.title,
        description: `__MODE:${dashboardMode}__${taskData.description}`,
        task_type: "daily",
        target_date: targetDate.toISOString().split("T")[0],
        completed: false,
        // Removed time_block and estimated_minutes from database insert
      }

      console.log("[v0] Inserting into database:", JSON.stringify(insertData, null, 2))

      const { data: insertedData, error } = await supabase.from("tasks").insert(insertData).select()

      if (error) {
        console.error("[v0] ERROR saving daily task to database:", error)
        console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      } else {
        console.log("[v0] SUCCESS! Task saved to database")
        console.log("[v0] Inserted data:", JSON.stringify(insertedData, null, 2))
      }
    } catch (err) {
      console.error("[v0] EXCEPTION during database operation:", err)
      console.error("[v0] Exception details:", JSON.stringify(err, null, 2))
    }
  }

  const addWeeklyTask = async () => {
    console.log("[v0] addWeeklyTask called with:", newWeeklyTask)
    console.log("[v0] Dashboard mode:", dashboardMode)
    console.log("[v0] User ID:", user?.id)

    if (!newWeeklyTask.title || !newWeeklyTask.category) {
      console.log("[v0] Validation failed - title or category missing")
      return
    }

    const taskId = crypto.randomUUID()
    const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
    const setTargetWeeklyTasks = dashboardMode === "standard" ? setStandardWeeklyTasks : setWeeklyTasks

    setTargetWeeklyTasks((prev) => ({
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
          priority: newWeeklyTask.priority,
          estimatedHours: newWeeklyTask.estimatedHours,
        },
      ],
    }))

    try {
      if (!user?.id) {
        console.error("[v0] User not authenticated")
        return
      }

      console.log("[v0] Looking up category:", newWeeklyTask.category)

      // Find category ID from database
      const { data: categories } = await supabase
        .from("categories")
        .select("id")
        .eq("name", newWeeklyTask.category)
        .eq("user_id", user.id)
        .single()

      console.log("[v0] Category lookup result:", categories)

      const { error } = await supabase.from("tasks").insert({
        id: taskId,
        user_id: user.id,
        category_id: categories?.id || null,
        goal_id: newWeeklyTask.goalId || null,
        title: newWeeklyTask.title,
        description: `__MODE:${dashboardMode}__${newWeeklyTask.description}`,
        task_type: "weekly",
        target_date: new Date().toISOString().split("T")[0],
        completed: false,
      })

      if (error) {
        console.error("[v0] Error saving weekly task to database:", error.message)
      } else {
        console.log("[v0] Weekly task saved to database successfully")
      }
    } catch (error) {
      console.error("[v0] Error saving weekly task to database:", error)
    }

    console.log("[v0] Resetting form and closing dialog")

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

      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
      const todayString = today.toISOString().split("T")[0] // Format: YYYY-MM-DD
      const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

      if (dayOfWeek === 1 && tasks && tasks.length > 0) {
        const completedDailyTasksToDelete = tasks.filter(
          (task) => task.task_type === "daily" && task.completed && task.target_date < todayString,
        )

        if (completedDailyTasksToDelete.length > 0) {
          const taskIds = completedDailyTasksToDelete.map((t) => t.id)
          const { error: deleteError } = await supabase.from("tasks").delete().in("id", taskIds)

          if (deleteError) {
            console.error("[v0] Error deleting completed daily tasks:", deleteError)
          } else {
            console.log(`[v0] Deleted ${completedDailyTasksToDelete.length} completed daily task(s) from previous week`)
            // Remove deleted tasks from the tasks array
            tasks.splice(0, tasks.length, ...tasks.filter((t) => !taskIds.includes(t.id)))
          }
        }
      }

      console.log("[v0] Today's date:", todayString)
      console.log("[v0] Checking for incomplete daily tasks to move...")

      if (tasks && tasks.length > 0) {
        const tasksToUpdate: string[] = []
        const completedRecurringTasks: any[] = []

        for (const task of tasks) {
          if (task.task_type === "daily") {
            console.log(
              `[v0] Daily task: "${task.title}", completed: ${task.completed}, target_date: ${task.target_date}`,
            )

            if (!task.completed) {
              const taskDate = new Date(task.target_date)
              taskDate.setHours(0, 0, 0, 0)

              console.log(
                `[v0] Task date: ${taskDate.toISOString()}, Today: ${today.toISOString()}, Is past: ${taskDate < today}`,
              )

              if (taskDate < today) {
                console.log(`[v0] Moving incomplete task "${task.title}" from ${task.target_date} to ${todayString}`)
                tasksToUpdate.push(task.id)

                // Update the task's target_date in the database
                const { error: updateError } = await supabase
                  .from("tasks")
                  .update({ target_date: todayString })
                  .eq("id", task.id)

                if (updateError) {
                  console.error(`[v0] Error updating task ${task.id}:`, updateError)
                } else {
                  console.log(`[v0] Successfully updated task ${task.id} in database`)
                  // Update the task object in memory so it's organized correctly
                  task.target_date = todayString
                }
              }
            } else {
              // Check if completed task is from yesterday and should be duplicated for today
              const taskDateStr = task.target_date.split("T")[0] // Get just the date part (YYYY-MM-DD)
              const yesterdayStr = new Date(today)
              yesterdayStr.setDate(yesterdayStr.getDate() - 1)
              const yesterdayDateStr = yesterdayStr.toISOString().split("T")[0]

              console.log(
                `[v0] Completed task "${task.title}" - date: ${taskDateStr}, yesterday: ${yesterdayDateStr}, is from yesterday: ${taskDateStr === yesterdayDateStr}`,
              )

              if (taskDateStr === yesterdayDateStr && task.target_count) {
                console.log(
                  `[v0] Duplicating completed recurring task "${task.title}" to today with counter: ${task.counter || 0}`,
                )
                completedRecurringTasks.push({
                  user_id: task.user_id,
                  goal_id: task.goal_id,
                  category_id: task.category_id,
                  title: task.title,
                  task_type: task.task_type,
                  target_date: todayString,
                  completed: false,
                  completed_at: null,
                  created_at: task.created_at,
                  updated_at: new Date().toISOString(),
                  description: task.description,
                  time_block: task.time_block,
                  estimated_minutes: task.estimated_minutes,
                  agent_id: task.agent_id,
                  sort_order: task.sort_order,
                  linked_goal_id: task.linked_goal_id,
                  counter: task.counter || 0, // Preserve the counter from yesterday
                  target_count: task.target_count,
                  daily_target: task.daily_target,
                })
              }
            }
          }
        }

        // Insert duplicated completed recurring tasks for today
        if (completedRecurringTasks.length > 0) {
          const { error: insertError } = await supabase.from("tasks").insert(completedRecurringTasks)

          if (insertError) {
            console.error("[v0] Error inserting duplicated tasks:", insertError)
          } else {
            console.log(`[v0] Successfully duplicated ${completedRecurringTasks.length} recurring task(s) to today`)
            // Add the duplicated tasks to the tasks array
            tasks.push(...completedRecurringTasks)
          }
        }

        if (tasksToUpdate.length > 0) {
          console.log(`[v0] Moved ${tasksToUpdate.length} incomplete task(s) to today`)
        } else {
          console.log(`[v0] No incomplete tasks needed to be moved`)
        }
      }

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
      const standardWeeklyTasks: Record<string, WeeklyTask[]> = {}
      const standardDailyTasks: Record<string, DailyTask[]> = {}

      const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      allDays.forEach((day) => {
        dailyTasks[day] = []
        standardDailyTasks[day] = []
      })

      tasks.forEach((task: any) => {
        console.log(`Processing task:`, JSON.stringify(task, null, 2))

        // Extract mode from description if stored with delimiter
        let taskMode = "12-week" // default
        let displayDescription = task.description || ""
        
        if (task.description?.startsWith("__MODE:")) {
          const endIndex = task.description.indexOf("__", 7)
          if (endIndex > 7) {
            taskMode = task.description.substring(7, endIndex)
            displayDescription = task.description.substring(endIndex + 2)
          }
        }

        // Select the appropriate task collections based on mode
        const targetWeeklyTasks = taskMode === "standard" ? standardWeeklyTasks : weeklyTasks
        const targetDailyTasks = taskMode === "standard" ? standardDailyTasks : dailyTasks

        const categoryName = task.categories?.name || "Uncategorized"

        if (task.task_type === "weekly") {
          // Use calendar-based week system - all users start from January 1st
          const taskDate = new Date(task.target_date)
          const year = taskDate.getFullYear()
          const startOfYear = new Date(year, 0, 1) // January 1st
          const daysDiff = Math.floor((taskDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
          const taskWeek = Math.floor(daysDiff / 7) + 1

          // For 12-week mode: only show tasks in the current 12-week cycle
          if (taskMode === "12-week") {
            const currentCycleNumber = Math.ceil(currentWeek / 13) || 1
            const taskCycleNumber = Math.ceil(taskWeek / 13)
            if (taskCycleNumber !== currentCycleNumber) {
              console.log(`[v0] Skipping task outside current 12-week cycle: week ${taskWeek} (cycle ${taskCycleNumber})`)
              return
            }
            const weekInCycle = taskWeek - (currentCycleNumber - 1) * 13
            const displayWeek = Math.min(weekInCycle, 12)
            const weekKey = `Week ${displayWeek}`
            
            const weeklyTask: WeeklyTask = {
              id: task.id,
              title: task.title || "",
              description: displayDescription,
              category: categoryName,
              goalId: task.goalId || "",
              completed: !!task.completed,
              priority: "medium",
              estimatedHours: 1,
              linked_goal_id: task.linked_goal_id || null,
              counter: task.counter || 0,
              target_count: task.target_count || null,
              weekly_target: task.weekly_target || null,
            }

            if (!targetWeeklyTasks[weekKey]) {
              targetWeeklyTasks[weekKey] = []
            }
            targetWeeklyTasks[weekKey].push(weeklyTask)
          } else {
            // Standard mode: show all weeks (1-52)
            const weekKey = `Week ${taskWeek}`
            
            const weeklyTask: WeeklyTask = {
              id: task.id,
              title: task.title || "",
              description: displayDescription,
              category: categoryName,
              goalId: task.goalId || "",
              completed: !!task.completed,
              priority: "medium",
              estimatedHours: 1,
              linked_goal_id: task.linked_goal_id || null,
              counter: task.counter || 0,
              target_count: task.target_count || null,
              weekly_target: task.weekly_target || null,
            }

            if (!targetWeeklyTasks[weekKey]) {
              targetWeeklyTasks[weekKey] = []
            }
            targetWeeklyTasks[weekKey].push(weeklyTask)
          }
        } else if (task.task_type === "daily") {
          const [yearValue, month, day] = task.target_date.split("-").map(Number)
          const dailyTaskDate = new Date(yearValue, month - 1, day) // month is 0-indexed
          const dayName = dailyTaskDate.toLocaleDateString("en-US", { weekday: "long" })

          console.log(`Adding ${taskMode} daily task to ${dayName} (target_date: ${task.target_date})`)
          console.log(
            `[v0] Daily task "${task.title}" - completed: ${task.completed}, target_date: ${task.target_date}, assigned to: ${dayName}`,
          )

          if (task.title?.includes("Buy Car1")) {
            console.log("[v0] PROCESSING 'Buy Car1' as daily task:")
            console.log("[v0]   - Will be added to day:", dayName)
            console.log("[v0]   - Completed:", !!task.completed)
          }

          const dailyTask: DailyTask = {
            id: task.id,
            title: task.title || "",
            description: displayDescription,
            category: categoryName,
            goalId: task.goalId || "",
            completed: !!task.completed,
            timeBlock: task.time_block || "9:00 AM", // Use stored time_block
            estimatedMinutes: task.estimated_minutes || 30, // Use stored estimated_minutes
            target_date: task.target_date, // Add target_date to dailyTask interface for edit functionality
            linked_goal_id: task.linked_goal_id || undefined,
            counter: task.counter || 0,
            target_count: task.target_count || undefined,
            daily_target: task.daily_target ? Number(task.daily_target) : undefined,
          }

          // Ensure the day exists in the appropriate dailyTasks object before pushing
          if (!targetDailyTasks[dayName]) {
            targetDailyTasks[dayName] = []
          }
          targetDailyTasks[dayName].push(dailyTask)
        }
      })

      console.log("=== FINAL ORGANIZED TASKS ===")
      console.log("Organized 12-week daily tasks:", JSON.stringify(dailyTasks, null, 2))
      console.log("Organized 12-week weekly tasks:", JSON.stringify(weeklyTasks, null, 2))
      console.log("Organized standard daily tasks:", JSON.stringify(standardDailyTasks, null, 2))
      console.log("Organized standard weekly tasks:", JSON.stringify(standardWeeklyTasks, null, 2))

      return { weeklyTasks, dailyTasks, standardWeeklyTasks, standardDailyTasks }
    } catch (error) {
      console.error("Error in loadTasksFromDB:", error)
      return { weeklyTasks: {}, dailyTasks: {} }
    }
  }

  const loadLongTermGoalsFromDB = async () => {
    if (!selectedAgentId) return

    try {
      const { data: longTermGoalsData, error } = await supabase
        .from("long_term_goals")
        .select("*")
        .eq("user_id", selectedAgentId)

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
        setLongTermGoals(groupedGoals)
      } else {
        setLongTermGoals({
          "1-year": {},
          "5-year": {},
        })
      }
    } catch (error) {
      console.error("Error loading long-term goals:", error)
    }
  }

  // Removed the redundant useEffect for loadLongTermGoalsFromDB as it's now called within checkDatabaseAndLoadData
  // useEffect(() => {
  //   if (user?.id && selectedAgentId) {
  //     loadLongTermGoalsFromDB()
  //   }
  // }, [user?.id, selectedAgentId])

  // const dashboardMode = user?.preferences?.dashboardMode || "12-week" // OLD CODE

  // Function to auto-generate daily tasks
  const autoGenerateDailyTasks = async (
    userId: string,
    goalsData: GoalsData,
    existingDailyTasks: Record<string, DailyTask[]>,
  ) => {
    const today = new Date()
    // Use local date components instead of toISOString which uses UTC
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const todayStr = `${year}-${month}-${day}`
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" })

    console.log(`[v0] Auto-generate checking for date: ${todayStr} (${dayName})`)

    // Fetch all goals with distribute_daily enabled from database
    const { data: distributedGoals, error } = await supabase
      .from("goals")
      .select(
        `
        id,
        title,
        target_count,
        daily_target,
        distribute_daily,
        category_id,
        categories (name)
      `,
      )
      .eq("user_id", userId)
      .eq("distribute_daily", true)

    if (error) {
      console.error("[v0] Error fetching distributed goals:", error)
      return
    }

    if (!distributedGoals || distributedGoals.length === 0) {
      console.log("[v0] No goals with distribute_daily enabled")
      return
    }

    console.log(`[v0] Found ${distributedGoals.length} goals with distribute_daily enabled`)

    // Flatten existing daily tasks to check for duplicates
    const allExistingTasks = Object.values(existingDailyTasks).flat()

    for (const goal of distributedGoals) {
      // Check if a task already exists for this goal today
      const existingTaskForGoal = allExistingTasks.find(
        (task) => task.linked_goal_id === goal.id && task.target_date === todayStr,
      )

      if (existingTaskForGoal) {
        console.log(`[v0] Task already exists for goal "${goal.title}" today, skipping`)
        continue
      }

      // Create a new daily task for this goal
      const dailyTaskId = crypto.randomUUID()
      const dailyTarget = goal.daily_target || Math.ceil((goal.target_count || 0) / 84)
      const categoryName = goal.categories?.name || "Uncategorized"

      console.log(`[v0] Auto-generating daily task for goal "${goal.title}" (daily target: ${dailyTarget})`)

      // Insert into database
      const { error: insertError } = await supabase.from("tasks").insert({
        id: dailyTaskId,
        user_id: userId,
        title: goal.title,
        description: `Daily target: ${dailyTarget}`,
        category_id: goal.category_id,
        task_type: "daily",
        target_date: todayStr,
        linked_goal_id: goal.id,
        counter: 0,
        target_count: goal.target_count,
        daily_target: dailyTarget,
        completed: false,
      })

      if (insertError) {
        console.error(`[v0] Error creating daily task for goal "${goal.title}":`, insertError)
        continue
      }

      // Add to local state
      const newTask: DailyTask = {
        id: dailyTaskId,
        title: goal.title,
        description: `Daily target: ${dailyTarget}`,
        category: categoryName,
        goalId: goal.id,
        completed: false,
        timeBlock: "",
        estimatedMinutes: 0,
        target_date: todayStr,
        linked_goal_id: goal.id,
        counter: 0,
        target_count: goal.target_count,
        daily_target: dailyTarget,
      }

      setDailyTasks((prev) => ({
        ...prev,
        [dayName]: [...(prev[dayName] || []), newTask],
      }))

      console.log(`[v0] Successfully auto-generated daily task for goal "${goal.title}"`)
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Full-width Top Header Bar */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-white px-6 w-full">
        <div>
          <Image
            src="/layson-group-logo.png"
            alt="Layson Group"
            width={150}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </div>

        {/* Right side: Avatar dropdown and Mobile hamburger menu */}
        <div className="flex items-center gap-2">
          {/* Desktop Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden lg:flex items-center space-x-2">
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
              <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Profile Settings</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                    <DialogDescription>Manage your user profile information.</DialogDescription>
                  </DialogHeader>
                  <UserProfile onClose={() => setShowProfile(false)} />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowProfile(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem asChild>
                <SignOutButton className="w-full text-left" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu - Sheet with Navigation + Settings */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <nav className="flex flex-col h-full">
                {/* Navigation Items */}
                <div className="flex-1 overflow-auto py-4">
                  <div className="space-y-2 px-4">
                    <Link href="/" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <LayoutDashboard className="mr-3 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/long-term-goals" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <Target className="mr-3 h-4 w-4" />
                        Long-term Goals
                      </Button>
                    </Link>
                    <Link href="/agents" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <Users className="mr-3 h-4 w-4" />
                        Agents
                      </Button>
                    </Link>
                    <Link href="/fitness" className="block">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <Activity className="mr-3 h-4 w-4" />
                        Fitness
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Settings and Sign Out at Bottom */}
                <div className="border-t space-y-2 p-4">
                  <Dialog open={showProfile} onOpenChange={(open) => {
                    setShowProfile(open)
                    if (!open) setMenuOpen(false)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start text-base">
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                      <DialogHeader>
                        <DialogTitle>Profile Settings</DialogTitle>
                        <DialogDescription>Manage your user profile information.</DialogDescription>
                      </DialogHeader>
                      <UserProfile onClose={() => setShowProfile(false)} />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowProfile(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <SignOutButton className="w-full justify-start text-base px-4 py-2 h-10 inline-flex items-center rounded-md hover:bg-accent hover:text-accent-foreground" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>


        </div>
      </header>

      {/* Sidebar and Content Area */}
      <div className="flex flex-1 overflow-hidden w-full">
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        <SidebarInset className="flex-1 min-w-0 w-full">
          <main className="h-full overflow-auto p-6 lg:px-20 bg-slate-50">
              <div className="w-full space-y-6">
                {/* Header */}
                <div className="w-full flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Hi {selectedAgentName?.split(" ")[0] || user?.name?.split(" ")[0] || "there"},
                    </h1>
                    <p className="text-gray-600">
                      Here are your tasks for week {currentWeek} of {dashboardMode === "standard" ? 52 : 12}.
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:space-x-2">
                    {(currentWeek === 12 && dashboardMode === "12-week") ||
                      (currentWeek === 52 && dashboardMode === "standard" && (
                        <Button onClick={startNewCycle} className="text-sm bg-green-600 hover:bg-green-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Start New Goal Cycle
                        </Button>
                      ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* CHANGE: Updated border and shadow styling to match daily task containers */}
                  <Card className="border border-border shadow-md">
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

                  <Card className="border border-border shadow-md">
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

                  <Card className="border border-border shadow-md">
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

                  <Card className="border border-border shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                        <p className="text-4xl font-bold text-gray-900">
                          {(() => {
                            const weeksLeft = dashboardMode === "standard" ? 53 - currentWeek : 13 - currentWeek
                            console.log("[v0] Weeks display - currentWeek:", currentWeek, "dashboardMode:", dashboardMode, "weeksLeft:", weeksLeft)
                            return weeksLeft
                          })()}
                        </p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-[#05a7b0]" />
                          <p className="text-sm font-medium text-gray-600">Weeks Left</p>
                        </div>
                        <div className="w-full">
                          <Progress
                            value={
                              dashboardMode === "standard"
                                ? ((currentWeek - 1) / 52) * 100
                                : ((currentWeek - 1) / 12) * 100
                            }
                            className="h-2 [&>div]:bg-[#05a7b0]"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs value={activeView} onValueChange={setActiveView} className="mb-8">
                  {/* Desktop Tabs */}
                  <TabsList className="hidden md:grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly Goals</TabsTrigger>
                    {dashboardMode === "12-week" ? (
                      <TabsTrigger value="1-week">12-Week Goals</TabsTrigger>
                    ) : (
                      <TabsTrigger value="1-year">1-Year Goals</TabsTrigger>
                    )}
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  {/* Mobile Dropdown Selector */}
                  <div className="md:hidden mb-8">
                    <Select value={activeView} onValueChange={setActiveView}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Tasks</SelectItem>
                        <SelectItem value="weekly">Weekly Goals</SelectItem>
                        {dashboardMode === "12-week" ? (
                          <SelectItem value="1-week">12-Week Goals</SelectItem>
                        ) : (
                          <SelectItem value="1-year">1-Year Goals</SelectItem>
                        )}
                        <SelectItem value="notes">Notes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 12-Week Goals View */}
                  <TabsContent value="1-week" className="mt-8 w-full" data-page="twelve-week">
                    {Object.keys(goalsData).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="text-center space-y-4">
                          <div className="flex justify-center">
                            <div className="rounded-full bg-muted p-4">
                              <Target className="h-8 w-8 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No goals yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                              Get started by adding your first category to track your progress over the next 12 weeks.
                            </p>
                          </div>
                          <Button onClick={() => setShowAddCategory(true)} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add your first category
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                        className={
                                          goals.length > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-600"
                                        }
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
                                        Add first goal
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
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 flex-shrink-0"
                                                  >
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
                    )}
                  </TabsContent>

                  {/* Weekly Tasks View */}
                  <TabsContent value="weekly" className="mt-8 w-full">
                    <div className="w-full flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Week {currentWeek} Goals</h2>
                    </div>

                    {/* Group weekly tasks by category */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {Object.keys(dashboardMode === "standard" ? oneYearGoalsData : goalsData).map((category) => {
                        const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
                        const categoryTasks = (targetWeeklyTasks[`Week ${currentWeek}`] || []).filter(
                          (task) => task.category === category,
                        )

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
                            {categoryTasks.length > 0 && (
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
                                              const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
                                              const setTargetWeeklyTasks = dashboardMode === "standard" ? setStandardWeeklyTasks : setWeeklyTasks
                                              setTargetWeeklyTasks((prev) => ({
                                                ...prev,
                                                [weekKey]: prev[weekKey]?.filter((task) => task.id !== taskId) || [],
                                              }))
                                            } catch (error) {
                                              console.error("Error deleting weekly task:", error)
                                            }
                                          }
                                          deleteWeeklyTask(`Week ${currentWeek}`, task.id)
                                        }}
                                        getPriorityColor={getPriorityColor}
                                        onUpdateCounter={(newCount) => {
                                          const weeklyTarget = task.weekly_target || task.target_count || 0
                                          const isCompleted = newCount >= weeklyTarget
                                          const targetWeeklyTasks = dashboardMode === "standard" ? standardWeeklyTasks : weeklyTasks
                                          const setTargetWeeklyTasks = dashboardMode === "standard" ? setStandardWeeklyTasks : setWeeklyTasks
                                          const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks

                                          // Update task counter and completion status
                                          setTargetWeeklyTasks((prev) => ({
                                            ...prev,
                                            [`Week ${currentWeek}`]:
                                              prev[`Week ${currentWeek}`]?.map((t) =>
                                                t.id === task.id
                                                  ? { ...t, counter: newCount, completed: isCompleted }
                                                  : t,
                                              ) || [],
                                          }))

                                          // Sync to linked 12-week goal if exists
                                          if (task.linked_goal_id) {
                                            // Calculate total progress from all linked tasks
                                            let totalProgress = newCount
                                            Object.values(targetWeeklyTasks).forEach((weekTasks) => {
                                              weekTasks.forEach((t) => {
                                                if (t.linked_goal_id === task.linked_goal_id && t.id !== task.id) {
                                                  totalProgress += t.counter || 0
                                                }
                                              })
                                            })
                                            Object.values(targetDailyTasks).forEach((dayTasks) => {
                                              dayTasks.forEach((t) => {
                                                if (t.linked_goal_id === task.linked_goal_id) {
                                                  totalProgress += t.counter || 0
                                                }
                                              })
                                            })
                                            updateGoalProgress(task.linked_goal_id, totalProgress)
                                          }

                                          // Update database
                                          supabase
                                            .from("tasks")
                                            .update({ counter: newCount, completed: isCompleted })
                                            .eq("id", task.id)
                                            .then(({ error }) => {
                                              if (error) console.error("Error updating weekly task counter:", error)
                                            })
                                        }}
                                      />
                                    ))}
                                  </SortableContext>
                                </DndContext>
                              </CardContent>
                            )}
                          </Card>
                        )
                      })}

                      {/* Uncategorized Tasks */}
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
                                          }
                                        }
                                        deleteWeeklyTask(`Week ${currentWeek}`, task.id)
                                      }}
                                      getPriorityColor={getPriorityColor}
                                      onUpdateCounter={(newCount) => {
                                        const weeklyTarget = task.weekly_target || task.target_count || 0
                                        const isCompleted = newCount >= weeklyTarget

                                        // Update task counter and completion status
                                        setWeeklyTasks((prev) => ({
                                          ...prev,
                                          [`Week ${currentWeek}`]:
                                            prev[`Week ${currentWeek}`]?.map((t) =>
                                              t.id === task.id
                                                ? { ...t, counter: newCount, completed: isCompleted }
                                                : t,
                                            ) || [],
                                        }))

                                        // Sync to linked 12-week goal if exists
                                        if (task.linked_goal_id) {
                                          let totalProgress = newCount
                                          Object.values(weeklyTasks).forEach((weekTasks) => {
                                            weekTasks.forEach((t) => {
                                              if (t.linked_goal_id === task.linked_goal_id && t.id !== task.id) {
                                                totalProgress += t.counter || 0
                                              }
                                            })
                                          })
                                          Object.values(dailyTasks).forEach((dayTasks) => {
                                            dayTasks.forEach((t) => {
                                              if (t.linked_goal_id === task.linked_goal_id) {
                                                totalProgress += t.counter || 0
                                              }
                                            })
                                          })
                                          updateGoalProgress(task.linked_goal_id, totalProgress)
                                        }

                                        // Update database
                                        supabase
                                          .from("tasks")
                                          .update({ counter: newCount, completed: isCompleted })
                                          .eq("id", task.id)
                                          .then(({ error }) => {
                                            if (error) console.error("Error updating weekly task counter:", error)
                                          })
                                      }}
                                    />
                                  ))}
                                </SortableContext>
                              </DndContext>
                            </CardContent>
                          </Card>
                        )
                      })()}

                      {/* If no tasks exist at all */}
                      {Object.keys(weeklyTasks).length === 0 && (
                        <div className="col-span-2 text-center py-12">
                          <p className="text-gray-500 mb-4">No weekly tasks yet</p>
                          <p className="text-sm text-gray-400">Use the + buttons in each category to add tasks</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Daily Tasks View */}
                  <TabsContent value="daily" className="mt-8 w-full">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Daily Tasks</h2>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewDailyTask((prev) => ({ ...prev, category: "" }))
                          setShowAddDailyTask(true)
                        }}
                        className="text-sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDailyTaskDragEnd}
                      >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
                          const dayTasks = targetDailyTasks[day] || []

                          return (
                            // Updated Card to use consistent border and shadow on all sides
                            <Card key={day} className="border border-border shadow-md">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base font-semibold">
                                    {day}
                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                      ({dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""})
                                    </span>
                                  </CardTitle>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => {
                                      setSelectedDay(day)
                                      setShowAddDailyTask(true)
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3 min-h-[60px]">
                                <SortableContext
                                  items={[day, ...dayTasks.map((task) => `${day}-${task.id}`)]} // Include day name as droppable target
                                  strategy={verticalListSortingStrategy}
                                >
                                  {dayTasks.length === 0 ? (
                                    <DroppableDayPlaceholder day={day} />
                                  ) : (
                                    dayTasks.map((task) => (
                                      <SortableDailyTaskItem
                                        key={task.id}
                                        task={task}
                                        taskId={`${day}-${task.id}`} // Pass prefixed ID to SortableDailyTaskItem
                                        onToggle={() => toggleDailyTask(day, task.id)}
                                        onEdit={() => startEditingDailyTask(task)}
                                        onDelete={() => {
                                          const deleteDailyTask = async (taskId: string) => {
                                            try {
                                              await supabase.from("tasks").delete().eq("id", taskId)
                                              const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
                                              const setTargetDailyTasks = dashboardMode === "standard" ? setStandardDailyTasks : setDailyTasks
                                              setTargetDailyTasks((prev) => ({
                                                ...prev,
                                                [day]: prev[day]?.filter((task) => task.id !== taskId) || [],
                                              }))
                                            } catch (error) {
                                              console.error("Error deleting daily task:", error)
                                            }
                                          }
                                          deleteDailyTask(task.id)
                                        }}
                                        onUpdateCounter={(newCount) => {
                                          const dailyTarget = task.daily_target || task.target_count || 0
                                          const isCompleted = newCount >= dailyTarget
                                          const targetDailyTasks = dashboardMode === "standard" ? standardDailyTasks : dailyTasks
                                          const setTargetDailyTasks = dashboardMode === "standard" ? setStandardDailyTasks : setDailyTasks

                                          // Update task counter and completion status
                                          setTargetDailyTasks((prev) => ({
                                            ...prev,
                                            [day]:
                                              prev[day]?.map((t) =>
                                                t.id === task.id
                                                  ? { ...t, counter: newCount, completed: isCompleted }
                                                  : t,
                                              ) || [],
                                          }))

                                          // Sync to linked 12-week goal if exists
                                          if (task.linked_goal_id) {
                                            // Calculate new goal progress by summing all linked tasks
                                            let totalProgress = newCount
                                            // Add progress from other days' tasks linked to same goal
                                            Object.values(targetDailyTasks).forEach((dayTasks) => {
                                              dayTasks.forEach((t) => {
                                                if (t.linked_goal_id === task.linked_goal_id && t.id !== task.id) {
                                                  totalProgress += t.counter || 0
                                                }
                                              })
                                            })
                                            updateGoalProgress(task.linked_goal_id, totalProgress)
                                          }

                                          // Update database
                                          supabase
                                            .from("tasks")
                                            .update({ counter: newCount, completed: isCompleted })
                                            .eq("id", task.id)
                                            .then(({ error }) => {
                                              if (error) console.error("Error updating task counter:", error)
                                            })
                                        }}
                                      />
                                    ))
                                  )}
                                </SortableContext>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </DndContext>
                    </div>
                  </TabsContent>

                  {/* 1-Year Goals View */}
                  <TabsContent value="1-year" className="mt-8 w-full" data-page="one-year">
                    {Object.keys(oneYearGoalsData).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="text-center space-y-4">
                          <div className="flex justify-center">
                            <div className="rounded-full bg-muted p-4">
                              <Target className="h-8 w-8 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">No goals yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                              Get started by adding your first category to track your progress over the next year.
                            </p>
                          </div>
                          <Button onClick={() => setShowAddCategory(true)} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add your first category
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {Object.entries(oneYearGoalsData).map(([category, goals]) => (
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
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => startEditingCategory(category)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Category
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => setShowDeleteCategory(category)}
                                        className={
                                          goals.length > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-600"
                                        }
                                        disabled={goals.length > 0}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {goals.length > 0 ? "Delete Category (remove goals first)" : "Delete Category"}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {goals.map((goal) => {
                                  const progressPercentage =
                                    goal.targetCount && goal.targetCount > 0
                                      ? Math.round((goal.currentCount || 0) / goal.targetCount * 100)
                                      : 0
                                  const goalType = getGoalType(goal.targetCount)
                                  const quickIncrements = getQuickIncrements(goal.targetCount)
                                  const isCompleted = goal.currentCount >= goal.targetCount

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
                                              <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 flex-shrink-0"
                                                  >
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
                                })}

                                {goals.length === 0 && (
                                  <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground mb-4">No goals in this category yet</p>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedCategory(category)
                                        setShowAddGoal(true)
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Goal
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="notes" className="mt-8 w-full">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Category Notes</h2>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        {Object.keys(goalsData).map((categoryName) => (
                          <Card key={categoryName} className="border-0 shadow-sm">
                            <CardHeader>
                              <CardTitle>
                                {categoryName}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {/* Add new note input */}
                                <div className="flex gap-2">
                                  <Input
                                    className="flex-1"
                                    value={newNoteText[categoryName] || ""}
                                    onChange={(e) =>
                                      setNewNoteText((prev) => ({
                                        ...prev,
                                        [categoryName]: e.target.value,
                                      }))
                                    }
                                    placeholder="Add a new note..."
                                    onKeyDown={async (e) => {
                                      if (e.key === "Enter" && newNoteText[categoryName]?.trim()) {
                                        try {
                                          const noteContent = `__MODE:${dashboardMode}__${newNoteText[categoryName].trim()}`
                                          const { data, error } = await supabase
                                            .from("notes")
                                            .insert({
                                              user_id: user?.id,
                                              category_name: categoryName,
                                              content: noteContent,
                                            })
                                            .select("id, content, created_at")
                                            .single()

                                          if (error) throw error
                                          
                                          // Use appropriate state based on dashboard mode
                                          const setTargetNotesData = dashboardMode === "standard" ? setStandardNotesData : setNotesData
                                          setTargetNotesData((prev) => ({
                                            ...prev,
                                            [categoryName]: [
                                              { id: data.id, content: newNoteText[categoryName].trim(), created_at: data.created_at },
                                              ...(prev[categoryName] || []),
                                            ],
                                          }))
                                          setNewNoteText((prev) => ({ ...prev, [categoryName]: "" }))
                                          toast({
                                            title: "Success",
                                            description: "Note added successfully",
                                          })
                                        } catch (error) {
                                          console.error("Error adding note:", error)
                                          toast({
                                            title: "Error",
                                            description: "Failed to add note",
                                            variant: "destructive",
                                          })
                                        }
                                      }
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={async () => {
                                      if (!newNoteText[categoryName]?.trim()) return
                                      try {
                                        const noteContent = `__MODE:${dashboardMode}__${newNoteText[categoryName].trim()}`
                                        const { data, error } = await supabase
                                          .from("notes")
                                          .insert({
                                            user_id: user?.id,
                                            category_name: categoryName,
                                            content: noteContent,
                                          })
                                          .select("id, content, created_at")
                                          .single()

                                        if (error) throw error
                                        
                                        // Use appropriate state based on dashboard mode
                                        const setTargetNotesData = dashboardMode === "standard" ? setStandardNotesData : setNotesData
                                        setTargetNotesData((prev) => ({
                                          ...prev,
                                          [categoryName]: [
                                            { id: data.id, content: newNoteText[categoryName].trim(), created_at: data.created_at },
                                            ...(prev[categoryName] || []),
                                          ],
                                        }))
                                        setNewNoteText((prev) => ({ ...prev, [categoryName]: "" }))
                                        toast({
                                          title: "Success",
                                          description: "Note added successfully",
                                        })
                                      } catch (error) {
                                        console.error("Error adding note:", error)
                                        toast({
                                          title: "Error",
                                          description: "Failed to add note",
                                          variant: "destructive",
                                        })
                                      }
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* List of notes */}
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                  {(() => {
                                    const targetNotesData = dashboardMode === "standard" ? standardNotesData : notesData
                                    return targetNotesData[categoryName] && targetNotesData[categoryName].length > 0 ? (
                                      targetNotesData[categoryName].map((note) => (
                                        <div
                                          key={note.id}
                                          className="group flex items-start justify-between p-2 rounded-md bg-muted/50 hover:bg-muted"
                                        >
                                          <div className="flex-1">
                                            <p className="text-sm">{note.content}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {new Date(note.created_at).toLocaleDateString()} at{" "}
                                              {new Date(note.created_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </p>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive"
                                            onClick={async () => {
                                              try {
                                                const { error } = await supabase.from("notes").delete().eq("id", note.id)

                                                if (error) throw error
                                                const setTargetNotesData = dashboardMode === "standard" ? setStandardNotesData : setNotesData
                                                setTargetNotesData((prev) => ({
                                                  ...prev,
                                                  [categoryName]: prev[categoryName].filter((n) => n.id !== note.id),
                                                }))
                                                toast({
                                                  title: "Success",
                                                  description: "Note deleted",
                                                })
                                              } catch (error) {
                                                console.error("Error deleting note:", error)
                                                toast({
                                                  title: "Error",
                                                  description: "Failed to delete note",
                                                  variant: "destructive",
                                                })
                                              }
                                            }}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-muted-foreground text-center py-4">
                                        No notes yet. Add your first note above.
                                      </p>
                                    )
                                  })()}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Add Goal Dialog */}
                <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
                      <DialogDescription>
                        {editingGoal ? "Update your goal details" : "Create a new goal to track your progress"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goal-title">Goal Title</Label>
                        <Input
                          id="goal-title"
                          placeholder="e.g., Run 100 miles, Read 12 books"
                          value={newGoal.title}
                          onChange={(e) => {
                            const title = e.target.value
                            const detectedNumber = extractNumberFromTitle(title)
                            setNewGoal((prev) => ({
                              ...prev,
                              title,
                              targetCount: detectedNumber > 0 ? detectedNumber : prev.targetCount,
                            }))
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="goal-description">Description (Optional)</Label>
                        <Textarea
                          id="goal-description"
                          placeholder="Add more details about your goal..."
                          value={newGoal.description}
                          onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="target-count">Target Count</Label>
                          <Input
                            id="target-count"
                            type="number"
                            min="1"
                            value={newGoal.targetCount || ""}
                            onChange={(e) =>
                              setNewGoal((prev) => ({ ...prev, targetCount: Number.parseInt(e.target.value) || 0 }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="weekly-target">Weekly Target</Label>
                          <Input
                            id="weekly-target"
                            type="number"
                            min="0"
                            step="0.1"
                            value={newGoal.weeklyTarget || ""}
                            onChange={(e) =>
                              setNewGoal((prev) => ({ ...prev, weeklyTarget: Number.parseFloat(e.target.value) || 0 }))
                            }
                            placeholder={`${Math.ceil((newGoal.targetCount || 1) / 12)}`}
                          />
                        </div>
                      </div>
                      {!editingGoal && (
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(dashboardMode === "12-week" ? goalsData : oneYearGoalsData).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {newGoal.targetCount > 0 && (
                        <div>
                          <Label className="mb-2 block">Add to Daily and Weekly Tasks</Label>
                          <div className="space-y-3">
                            {/* CHANGE: Moved Switch to left of label */}
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newGoal.distributeDaily}
                                onCheckedChange={(checked) =>
                                  setNewGoal((prev) => ({ ...prev, distributeDaily: checked }))
                                }
                              />
                              <span className="text-sm text-muted-foreground">Daily Tasks</span>
                            </div>
                            {/* CHANGE: Moved Switch to left of label */}
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newGoal.distributeWeekly}
                                onCheckedChange={(checked) =>
                                  setNewGoal((prev) => ({ ...prev, distributeWeekly: checked }))
                                }
                              />
                              <span className="text-sm text-muted-foreground">Weekly Tasks</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={editingGoal ? saveEditedGoal : addNewGoal}>
                        {editingGoal ? "Save Changes" : "Add Goal"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Goal Confirmation Dialog */}
                <Dialog open={!!showDeleteGoal} onOpenChange={() => setShowDeleteGoal(null)}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete Goal</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{showDeleteGoal?.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteGoal(null)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (showDeleteGoal) {
                            deleteGoal(showDeleteGoal.category, showDeleteGoal.goalId)
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Add Long Term Goal Modal */}
                <Dialog open={showAddLongTermGoal} onOpenChange={setShowAddLongTermGoal}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingLongTermGoal ? "Edit" : "Add"} {selectedTimeframe === "1-year" ? "1-Year" : "5-Year"}
                        Goal
                      </DialogTitle>
                      <DialogDescription>
                        {editingLongTermGoal
                          ? "Update your long-term goal"
                          : "Create a new long-term goal with milestones"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="lt-goal-title">Goal Title</Label>
                        <Input
                          id="lt-goal-title"
                          placeholder="e.g., Launch successful startup, Complete marathon"
                          value={newLongTermGoal.title}
                          onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lt-goal-description">Description</Label>
                        <Textarea
                          id="lt-goal-description"
                          placeholder="Describe your long-term vision..."
                          value={newLongTermGoal.description}
                          onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lt-target-date">Target Date</Label>
                          <Input
                            id="lt-target-date"
                            type="date"
                            value={newLongTermGoal.targetDate}
                            onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lt-category">Category</Label>
                          <Select
                            value={newLongTermGoal.category}
                            onValueChange={(value) => setNewLongTermGoal((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Business">Business</SelectItem>
                              <SelectItem value="Personal">Personal</SelectItem>
                              <SelectItem value="Financial">Financial</SelectItem>
                              <SelectItem value="Health">Health</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="lt-notes">Notes</Label>
                        <Textarea
                          id="lt-notes"
                          placeholder="Additional notes or strategy..."
                          value={newLongTermGoal.notes}
                          onChange={(e) => setNewLongTermGoal((prev) => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Milestones (Optional)</Label>
                        <div className="space-y-3 mt-2">
                          {newLongTermGoal.milestones.map((milestone, index) => (
                            <div key={index} className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder={`Milestone ${index + 1} title`}
                                value={milestone.title}
                                onChange={(e) => {
                                  const updatedMilestones = [...newLongTermGoal.milestones]
                                  updatedMilestones[index] = { ...updatedMilestones[index], title: e.target.value }
                                  setNewLongTermGoal((prev) => ({ ...prev, milestones: updatedMilestones }))
                                }}
                              />
                              <Input
                                type="date"
                                value={milestone.targetDate}
                                onChange={(e) => {
                                  const updatedMilestones = [...newLongTermGoal.milestones]
                                  updatedMilestones[index] = { ...updatedMilestones[index], targetDate: e.target.value }
                                  setNewLongTermGoal((prev) => ({ ...prev, milestones: updatedMilestones }))
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddLongTermGoal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={editingLongTermGoal ? saveEditedLongTermGoal : addLongTermGoal}>
                        {editingLongTermGoal ? "Save Changes" : "Add Goal"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAddWeeklyTask} onOpenChange={setShowAddWeeklyTask}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingWeeklyTask ? "Edit" : "Add"} Weekly Task</DialogTitle>
                      <DialogDescription>
                        {editingWeeklyTask ? "Update your weekly task" : "Create a new weekly task"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="weekly-task-title">Task Title</Label>
                        <Input
                          id="weekly-task-title"
                          placeholder="e.g., Review project proposals"
                          value={newWeeklyTask.title}
                          onChange={(e) => setNewWeeklyTask((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weekly-task-description">Description</Label>
                        <Textarea
                          id="weekly-task-description"
                          placeholder="Describe the task..."
                          value={newWeeklyTask.description}
                          onChange={(e) => setNewWeeklyTask((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weekly-task-category">Category</Label>
                        <Select
                          value={newWeeklyTask.category}
                          onValueChange={(value) => setNewWeeklyTask((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(goalsData).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="weekly-task-priority">Priority</Label>
                        <Select
                          value={newWeeklyTask.priority}
                          onValueChange={(value) =>
                            setNewWeeklyTask((prev) => ({ ...prev, priority: value as "low" | "medium" | "high" }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="weekly-task-hours">Estimated Hours</Label>
                        <Input
                          id="weekly-task-hours"
                          type="number"
                          min="1"
                          value={newWeeklyTask.estimatedHours}
                          onChange={(e) =>
                            setNewWeeklyTask((prev) => ({
                              ...prev,
                              estimatedHours: Number.parseInt(e.target.value) || 1,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddWeeklyTask(false)}>
                        Cancel
                      </Button>
                      <Button onClick={editingWeeklyTask ? saveEditedWeeklyTask : addWeeklyTask}>
                        {editingWeeklyTask ? "Save Changes" : "Add Task"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showAddDailyTask} onOpenChange={setShowAddDailyTask}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Daily Task</DialogTitle>
                      <DialogDescription>Create a new daily task</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="daily-task-title">Task Title</Label>
                        <Input
                          id="daily-task-title"
                          placeholder="e.g., Review project proposals"
                          value={newDailyTask.title}
                          onChange={(e) => setNewDailyTask((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="daily-task-description">Description</Label>
                        <Textarea
                          id="daily-task-description"
                          placeholder="Describe the task..."
                          value={newDailyTask.description}
                          onChange={(e) => setNewDailyTask((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="daily-task-category">Category</Label>
                        <Select
                          value={newDailyTask.category}
                          onValueChange={(value) => setNewDailyTask((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(goalsData).map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDailyTask(false)}>
                        Cancel
                      </Button>
                      <Button onClick={editingDailyTask ? saveEditedDailyTask : addDailyTask}>
                        {editingDailyTask ? "Save Task" : "Add Task"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* ADD CATEGORY DIALOG */}
                <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>Create a new category to organize your goals</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          placeholder="e.g., Business, Personal, Health"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addNewCategory()
                            }
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNewCategory}>Add Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </main>
          </SidebarInset>
        </div>

        {/* Weekly Recap Modal */}
        <Dialog open={showWeeklyRecap} onOpenChange={setShowWeeklyRecap}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Week {currentWeek} Recap</h2>
                <p className="text-slate-600 text-sm mt-1">
                  {(() => {
                    const recap = getWeeklyRecapData()
                    const totalCompleted = recap.completedTasks + recap.completedGoals
                    const totalItems = recap.totalTasks + recap.totalGoals
                    const completionPercent = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0
                    
                    if (completionPercent === 0) {
                      return "Time to get started! Here's your weekly summary"
                    } else if (completionPercent < 25) {
                      return "You're making progress! Here's your weekly summary"
                    } else if (completionPercent < 50) {
                      return "Nice work this week! Here's your weekly summary"
                    } else if (completionPercent < 75) {
                      return "Excellent progress! Here's your weekly summary"
                    } else {
                      return "Outstanding effort! Here's your weekly summary"
                    }
                  })()}
                </p>
              </div>

              {(() => {
                const recap = getWeeklyRecapData()
                return (
                  <div className="space-y-5">
                    {/* Tasks Completed - Card Style */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 border border-blue-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Tasks Completed</p>
                          <p className="text-3xl font-bold text-blue-600 mt-1">{recap.completedTasks}/{recap.totalTasks}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{Math.round((recap.completedTasks / Math.max(recap.totalTasks, 1)) * 100)}%</p>
                        </div>
                      </div>
                      <Progress value={(recap.completedTasks / Math.max(recap.totalTasks, 1)) * 100} className="h-2 [&>div]:bg-blue-600" />
                    </div>

                    {/* Weekly Goals - Card Style */}
                    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 border border-emerald-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Weekly Goals Hit</p>
                          <p className="text-3xl font-bold text-emerald-600 mt-1">{recap.completedGoals}/{recap.totalGoals}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">{Math.round((recap.completedGoals / Math.max(recap.totalGoals, 1)) * 100)}%</p>
                        </div>
                      </div>
                      <Progress value={(recap.completedGoals / Math.max(recap.totalGoals, 1)) * 100} className="h-2 [&>div]:bg-emerald-600" />
                    </div>

                    {/* Goal Progress - Card Style */}
                    <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border border-cyan-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-cyan-600 uppercase tracking-wide">Goal Progress</p>
                          <p className="text-3xl font-bold text-cyan-600 mt-1">{Math.round(recap.weeklyProgress)}%</p>
                        </div>
                      </div>
                      <Progress value={recap.weeklyProgress} className="h-2 [&>div]:bg-[#05a7b0]" />
                    </div>

                    {/* Streak Badge */}
                    {recap.streak > 0 && (
                      <div className="rounded-xl bg-gradient-to-br from-amber-50 to-rose-50 p-5 border-2 border-amber-300">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">🔥</div>
                          <div>
                            <p className="text-sm font-medium text-amber-900">Current Streak</p>
                            <p className="text-2xl font-bold text-amber-900">{recap.streak} week{recap.streak > 1 ? 's' : ''}</p>
                            <p className="text-xs text-amber-700 mt-0.5">Keep the momentum going!</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fitness */}
                    {(() => {
                      const metrics = getWeeklyFitnessMetrics()
                      return metrics ? (
                        <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 p-5 border border-rose-100">
                          <p className="text-sm font-medium text-rose-600 uppercase tracking-wide mb-4">Fitness</p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-rose-600">{metrics.activeDays}</p>
                              <p className="text-xs text-rose-600 mt-1">Active Days</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-rose-600">{metrics.longestStreak}</p>
                              <p className="text-xs text-rose-600 mt-1">Longest Streak</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-rose-600">{metrics.currentRanking}</p>
                              <p className="text-xs text-rose-600 mt-1">Ranking</p>
                            </div>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                )
              })()}

              {/* Footer */}
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowWeeklyRecap(false)} className="flex-1 text-white font-semibold bg-black hover:bg-gray-900">
                  Continue to Next Week
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* End of Cycle Recap Modal */}
        <Dialog open={showCycleRecap} onOpenChange={setShowCycleRecap}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-slate-900">12-Week Cycle Complete!</h2>
                <p className="text-slate-600 text-sm mt-1">Incredible effort! Here's your full cycle summary</p>
              </div>

              {(() => {
                const recap = getCycleRecapData()
                return (
                  <div className="space-y-5">
                    {/* Total Tasks - Card Style */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 border border-blue-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Tasks Completed</p>
                          <p className="text-3xl font-bold text-blue-600 mt-1">{recap.completedTasks}/{recap.totalTasks}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{Math.round((recap.completedTasks / Math.max(recap.totalTasks, 1)) * 100)}%</p>
                        </div>
                      </div>
                      <Progress value={(recap.completedTasks / Math.max(recap.totalTasks, 1)) * 100} className="h-2 [&>div]:bg-blue-600" />
                    </div>

                    {/* Goals Achieved - Card Style */}
                    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 border border-emerald-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Goals Achieved</p>
                          <p className="text-3xl font-bold text-emerald-600 mt-1">{recap.completedGoals}/{recap.totalGoals}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">{Math.round((recap.completedGoals / Math.max(recap.totalGoals, 1)) * 100)}%</p>
                        </div>
                      </div>
                      <Progress value={(recap.completedGoals / Math.max(recap.totalGoals, 1)) * 100} className="h-2 [&>div]:bg-emerald-600" />
                    </div>

                    {/* Cycle Progress - Card Style */}
                    <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 p-5 border border-cyan-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-cyan-600 uppercase tracking-wide">Cycle Progress</p>
                          <p className="text-3xl font-bold text-cyan-600 mt-1">{Math.round(recap.cycleProgress)}%</p>
                        </div>
                      </div>
                      <Progress value={recap.cycleProgress} className="h-2 [&>div]:bg-[#05a7b0]" />
                    </div>

                    {/* Performance Insight */}
                    {recap.cycleProgress >= 80 ? (
                      <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-5 border-2 border-green-300">
                        <p className="text-sm font-semibold text-green-900">🌟 EXCELLENT PERFORMANCE!</p>
                        <p className="text-sm text-green-800 mt-2">You achieved over 80% of your goals this cycle. Outstanding dedication!</p>
                      </div>
                    ) : recap.cycleProgress >= 60 ? (
                      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-5 border-2 border-blue-300">
                        <p className="text-sm font-semibold text-blue-900">✨ GREAT JOB!</p>
                        <p className="text-sm text-blue-800 mt-2">You're on track with solid progress this cycle. Keep pushing!</p>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 border-2 border-slate-300">
                        <p className="text-sm font-semibold text-slate-900">💪 SOLID EFFORT!</p>
                        <p className="text-sm text-slate-800 mt-2">Review your goals for the next cycle and adjust your strategy for better results.</p>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Footer */}
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowCycleRecap(false)} className="flex-1 text-white font-semibold bg-black hover:bg-gray-900">
                  Start New Cycle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default function Page() {
  const { user, isLoading: authLoading } = useAuth()

  console.log("[v0] Page render - user:", user, "isLoading:", authLoading)

  if (authLoading) {
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

  return (
    <SidebarProvider>
      <GoalTrackerApp />
    </SidebarProvider>
  )
}

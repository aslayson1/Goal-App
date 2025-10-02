"use client"

import { useState } from "react"
import { Plus, Target, Trash2, MoreHorizontal, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth/auth-provider"
import { SignOutButton } from "@/components/auth/sign-out-button"

const initialLongTermGoals = {
  "1-year": {
    Business: [
      {
        id: "1y_b1",
        title: "Scale Upside to 1,000 paid users",
        description: "Grow the platform to 1,000 paying customers with strong retention",
        targetDate: "2025-12-31",
        category: "Business",
        status: "in-progress" as const,
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
        status: "in-progress" as const,
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
        status: "in-progress" as const,
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
        status: "in-progress" as const,
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
        status: "in-progress" as const,
        notes: "Focus on building defensible moats and strong unit economics",
        milestones: [
          { id: "m1", title: "Reach $5M ARR", completed: false, targetDate: "2026-12-31" },
          { id: "m2", title: "Reach $15M ARR", completed: false, targetDate: "2027-12-31" },
          { id: "m3", title: "Reach $30M ARR", completed: false, targetDate: "2028-12-31" },
          { id: "m4", title: "Complete exit", completed: false, targetDate: "2029-12-31" },
        ],
      },
      {
        id: "5y_b2",
        title: "Build Layson Group into regional powerhouse",
        description: "Expand to 10+ markets with 100+ agents",
        targetDate: "2029-12-31",
        category: "Business",
        status: "in-progress" as const,
        notes: "Focus on culture, systems, and sustainable growth",
        milestones: [
          { id: "m1", title: "Reach 5 markets", completed: false, targetDate: "2026-12-31" },
          { id: "m2", title: "Reach 50 agents", completed: false, targetDate: "2027-12-31" },
          { id: "m3", title: "Reach 8 markets", completed: false, targetDate: "2028-12-31" },
          { id: "m4", title: "Reach 10 markets, 100 agents", completed: false, targetDate: "2029-12-31" },
        ],
      },
    ],
    Personal: [
      {
        id: "5y_p1",
        title: "Complete an Ironman triathlon",
        description: "Train for and complete a full Ironman distance triathlon",
        targetDate: "2028-08-15",
        category: "Personal",
        status: "in-progress" as const,
        notes: "Build endurance progressively through shorter races",
        milestones: [
          { id: "m1", title: "Complete Olympic distance triathlon", completed: false, targetDate: "2026-06-15" },
          { id: "m2", title: "Complete Half Ironman", completed: false, targetDate: "2027-06-15" },
          { id: "m3", title: "Complete second Half Ironman", completed: false, targetDate: "2028-03-15" },
          { id: "m4", title: "Complete full Ironman", completed: false, targetDate: "2028-08-15" },
        ],
      },
      {
        id: "5y_p2",
        title: "Take family on month-long European adventure",
        description: "Visit 6+ countries with the family for cultural immersion",
        targetDate: "2027-07-31",
        category: "Personal",
        status: "in-progress" as const,
        notes: "Plan for summer 2027, focus on history and culture",
        milestones: [
          { id: "m1", title: "Research and plan itinerary", completed: false, targetDate: "2026-12-31" },
          { id: "m2", title: "Book flights and accommodations", completed: false, targetDate: "2027-03-31" },
          { id: "m3", title: "Prepare kids with language basics", completed: false, targetDate: "2027-06-30" },
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
        status: "in-progress" as const,
        notes: "Diversify across businesses, real estate, and investments",
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

export default function LongTermGoalsPage() {
  const { user } = useAuth()

  const getInitials = (name: string | null | undefined) => {
    if (!name || typeof name !== "string") return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const [longTermGoals, setLongTermGoals] = useState<LongTermGoalsData>(initialLongTermGoals)
  const [showAddLongTermGoal, setShowAddLongTermGoal] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1-year" | "5-year">("1-year")
  const [selectedCategory, setSelectedCategory] = useState("")
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
  const [showProfile, setShowProfile] = useState(false)

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
    setShowAddLongTermGoal(true)
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

  const addLongTermGoal = () => {
    if (!newLongTermGoal.title || !newLongTermGoal.category) return

    const newGoal: LongTermGoal = {
      id: `${selectedTimeframe}_${Date.now()}`,
      title: newLongTermGoal.title,
      description: newLongTermGoal.description,
      targetDate: newLongTermGoal.targetDate,
      category: newLongTermGoal.category,
      status: "in-progress",
      notes: newLongTermGoal.notes,
      milestones: newLongTermGoal.milestones
        .filter((m) => m.title && m.targetDate)
        .map((m, index) => ({
          id: `m${index + 1}`,
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Business":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Personal":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Financial":
        return "bg-green-50 text-green-700 border-green-200"
      case "Health":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "Education":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const checkboxStyles =
    "data-[state=checked]:bg-black data-[state=checked]:border-black data-[state=checked]:text-white"

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
          <AppSidebar />
          <SidebarInset className="flex-1 overflow-auto">
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
              <Tabs defaultValue="1-year" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="1-year">1-Year Goals</TabsTrigger>
                  <TabsTrigger value="5-year">5-Year Goals</TabsTrigger>
                </TabsList>

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
                                      setNewLongTermGoal((prev) => ({ ...prev, category }))
                                      setShowAddLongTermGoal(true)
                                    }}
                                  >
                                    <Target className="h-4 w-4 mr-2" />
                                    Add Goal
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
                                  onCheckedChange={(checked) => {
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
                                  {goal.milestones.map((milestone) => (
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
                                      setNewLongTermGoal((prev) => ({ ...prev, category }))
                                      setShowAddLongTermGoal(true)
                                    }}
                                  >
                                    <Target className="h-4 w-4 mr-2" />
                                    Add Goal
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
                                  onCheckedChange={(checked) => {
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
                                  {goal.milestones.map((milestone) => (
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
            </div>
          </SidebarInset>
        </div>
      </div>

      <Dialog open={showAddLongTermGoal} onOpenChange={setShowAddLongTermGoal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLongTermGoal ? "Edit" : "Add"} {selectedTimeframe === "1-year" ? "1-Year" : "5-Year"} Goal
            </DialogTitle>
            <DialogDescription>
              {editingLongTermGoal ? "Update your long-term goal" : "Create a new long-term goal with milestones"}
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

      <Dialog open={!!showDeleteLongTermGoal} onOpenChange={() => setShowDeleteLongTermGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{showDeleteLongTermGoal?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteLongTermGoal(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (showDeleteLongTermGoal) {
                  deleteLongTermGoal(
                    showDeleteLongTermGoal.timeframe,
                    showDeleteLongTermGoal.category,
                    showDeleteLongTermGoal.goalId,
                  )
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

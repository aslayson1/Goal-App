"use client"

import { useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Target, Trophy, Calendar, MoreVertical, Edit, Trash2, GripVertical, User, Settings } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { AuthScreen } from "@/components/auth/auth-screen"
import { UserProfile } from "@/components/profile/user-profile"

interface Goal {
  id: string
  title: string
  description: string
  category: "work" | "personal" | "health" | "learning" | "finance"
  progress: number
  targetDate: string
  tasks: Task[]
  completed: boolean
}

interface Task {
  id: string
  title: string
  completed: boolean
}

const categoryColors = {
  work: "work",
  personal: "personal",
  health: "health",
  learning: "learning",
  finance: "finance",
} as const

function SortableGoalCard({
  goal,
  onUpdate,
  onDelete,
}: { goal: Goal; onUpdate: (goal: Goal) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: goal.id })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedGoal, setEditedGoal] = useState(goal)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSave = () => {
    onUpdate(editedGoal)
    setIsEditDialogOpen(false)
  }

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
      }
      setEditedGoal((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }))
      setNewTaskTitle("")
    }
  }

  const toggleTask = (taskId: string) => {
    setEditedGoal((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    }))
  }

  const deleteTask = (taskId: string) => {
    setEditedGoal((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
    }))
  }

  const completedTasks = goal.tasks.filter((task) => task.completed).length
  const totalTasks = goal.tasks.length
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <Card ref={setNodeRef} style={style} className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold">{goal.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">{goal.description}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={categoryColors[goal.category]}>{goal.category}</Badge>
          <span className="text-xs text-gray-500">Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(goal.progress)}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {goal.tasks.length > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tasks</span>
                <span>
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className="space-y-1">
                {goal.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => {
                        const updatedGoal = {
                          ...goal,
                          tasks: goal.tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
                        }
                        onUpdate(updatedGoal)
                      }}
                      className="h-3 w-3"
                    />
                    <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                  </div>
                ))}
                {goal.tasks.length > 3 && (
                  <div className="text-xs text-gray-500">+{goal.tasks.length - 3} more tasks</div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Make changes to your goal here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedGoal.title}
                onChange={(e) => setEditedGoal((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedGoal.description}
                onChange={(e) => setEditedGoal((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editedGoal.category}
                  onValueChange={(value: any) => setEditedGoal((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={editedGoal.progress}
                  onChange={(e) =>
                    setEditedGoal((prev) => ({ ...prev, progress: Number.parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={editedGoal.targetDate}
                onChange={(e) => setEditedGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Tasks</Label>
              <div className="space-y-2">
                {editedGoal.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                    <span className={`flex-1 ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                  />
                  <Button onClick={addTask} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function GoalTracker() {
  const { user, loading } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Learn TypeScript",
      description: "Master TypeScript fundamentals and advanced concepts",
      category: "learning",
      progress: 75,
      targetDate: "2024-12-31",
      tasks: [
        { id: "1", title: "Complete TypeScript handbook", completed: true },
        { id: "2", title: "Build a TypeScript project", completed: true },
        { id: "3", title: "Learn advanced types", completed: false },
      ],
      completed: false,
    },
    {
      id: "2",
      title: "Build Portfolio Website",
      description: "Create a professional portfolio to showcase my work",
      category: "work",
      progress: 50,
      targetDate: "2024-11-30",
      tasks: [
        { id: "4", title: "Design wireframes", completed: true },
        { id: "5", title: "Develop frontend", completed: false },
        { id: "6", title: "Deploy to production", completed: false },
      ],
      completed: false,
    },
    {
      id: "3",
      title: "Exercise Daily",
      description: "Maintain a consistent daily exercise routine",
      category: "health",
      progress: 90,
      targetDate: "2024-12-31",
      tasks: [
        { id: "7", title: "Morning workout", completed: true },
        { id: "8", title: "Evening walk", completed: true },
      ],
      completed: false,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    title: "",
    description: "",
    category: "personal",
    progress: 0,
    targetDate: "",
    tasks: [],
    completed: false,
  })
  const [activeTab, setActiveTab] = useState("goals")
  const [showProfile, setShowProfile] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#05a7b0]"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  if (showProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => setShowProfile(false)}>
              ← Back to Goals
            </Button>
          </div>
          <UserProfile />
        </div>
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setGoals((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal: Goal = {
        ...newGoal,
        id: Date.now().toString(),
      }
      setGoals((prev) => [...prev, goal])
      setNewGoal({
        title: "",
        description: "",
        category: "personal",
        progress: 0,
        targetDate: "",
        tasks: [],
        completed: false,
      })
      setIsAddDialogOpen(false)
    }
  }

  const updateGoal = (updatedGoal: Goal) => {
    setGoals((prev) => prev.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)))
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter((goal) => goal.progress === 100).length
  const averageProgress = goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goal Tracker</h1>
            <p className="text-gray-600 mt-1">Track your progress and achieve your dreams</p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
              <Target className="h-4 w-4 text-[#05a7b0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGoals}</div>
              <p className="text-xs text-gray-600">Active goals</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Trophy className="h-4 w-4 text-[#05a7b0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedGoals}</div>
              <p className="text-xs text-gray-600">Goals achieved</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <Calendar className="h-4 w-4 text-[#05a7b0]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageProgress)}%</div>
              <p className="text-xs text-gray-600">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Goals</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#05a7b0] hover:bg-[#048a92] text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                    <DialogDescription>Create a new goal to track your progress.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-title">Title</Label>
                      <Input
                        id="new-title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter goal title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-description">Description</Label>
                      <Textarea
                        id="new-description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your goal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-category">Category</Label>
                        <Select
                          value={newGoal.category}
                          onValueChange={(value: any) => setNewGoal((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="learning">Learning</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-targetDate">Target Date</Label>
                        <Input
                          id="new-targetDate"
                          type="date"
                          value={newGoal.targetDate}
                          onChange={(e) => setNewGoal((prev) => ({ ...prev, targetDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addGoal} className="bg-[#05a7b0] hover:bg-[#048a92] text-white">
                      Add Goal
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger value="goals">All Goals</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="goals" className="mt-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={goals.map((g) => g.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid gap-4">
                      {goals.map((goal) => (
                        <SortableGoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </TabsContent>
              <TabsContent value="active" className="mt-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={goals.filter((g) => g.progress < 100).map((g) => g.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid gap-4">
                      {goals
                        .filter((goal) => goal.progress < 100)
                        .map((goal) => (
                          <SortableGoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </TabsContent>
              <TabsContent value="completed" className="mt-6">
                <div className="grid gap-4">
                  {goals
                    .filter((goal) => goal.progress === 100)
                    .map((goal) => (
                      <SortableGoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Page() {
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

  return <GoalTracker />
}

export default Page

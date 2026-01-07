"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

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
  [category: string]: {
    id: string
    title: string
    description: string
    targetCount: number
    currentCount: number
    notes: string
    weeklyTarget: number
    category: string
  }[]
}

interface DailyTasksSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  dailyTasks: Record<string, DailyTask[]>
  goalsData: GoalsData
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
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

  return colors[category] || "bg-gray-100 text-gray-800 border-gray-200"
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function DailyTasksSummaryModal({ isOpen, onClose, dailyTasks, goalsData }: DailyTasksSummaryModalProps) {
  // Group tasks by day
  const tasksByDay = daysOfWeek.reduce(
    (acc, day) => {
      acc[day] = dailyTasks[day] || []
      return acc
    },
    {} as Record<string, DailyTask[]>,
  )

  // Calculate totals
  const totalTasks = Object.values(tasksByDay).flat().length
  const completedTasks = Object.values(tasksByDay)
    .flat()
    .filter((task) => task.completed).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daily Tasks Summary</DialogTitle>
          <DialogDescription>
            Overview of your daily tasks for the week • {completedTasks}/{totalTasks} completed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {daysOfWeek.map((day) => {
            const dayTasks = tasksByDay[day]

            return (
              <Card key={day} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    {day}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""})
                    </span>
                  </CardTitle>
                </CardHeader>
                {dayTasks.length > 0 && (
                  <CardContent className="space-y-2">
                    {dayTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                        <div className="mt-1">
                          {task.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded border border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                              {task.title}
                            </p>
                            <Badge
                              className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(task.category)}`}
                            >
                              {task.category}
                            </Badge>
                          </div>
                          {task.timeBlock && <p className="text-xs text-gray-500 mt-1">{task.timeBlock}</p>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

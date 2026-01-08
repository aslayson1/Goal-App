"use client"

import { useState } from "react"
import { Label, Textarea, Input } from "@/components/ui" // Assuming these components are imported

import type { LongTermGoal } from "@/types" // Assuming LongTermGoal is imported from a types file
import { createClient } from "@/lib/supabase/client" // Import supabase client
import { createLongTermGoal } from "@/lib/data/long-term-goals"

const Page = () => {
  const [editingLongTermGoal, setEditingLongTermGoal] = useState<{
    timeframe: "1-year" | "5-year"
    category: string
    goal: LongTermGoal
  } | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1-year" | "5-year">("1-year")
  const [newLongTermGoal, setNewLongTermGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "",
    notes: "",
    targetNumber: "",
    dailyTarget: 0,
    weeklyTarget: 0,
    milestones: [
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
      { title: "", targetDate: "" },
    ],
  })
  const [showAddLongTermGoal, setShowAddLongTermGoal] = useState(false)
  const [longTermGoals, setLongTermGoals] = useState<{
    "1-year": { [key: string]: LongTermGoal[] }
    "5-year": { [key: string]: LongTermGoal[] }
  }>({
    "1-year": {},
    "5-year": {},
  })
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null) // Assuming selectedAgentId is imported or set elsewhere

  const startEditingLongTermGoal = (timeframe: "1-year" | "5-year", category: string, goal: LongTermGoal) => {
    setEditingLongTermGoal({ timeframe, category, goal })
    setSelectedTimeframe(timeframe)
    setNewLongTermGoal({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      category: goal.category,
      notes: goal.notes,
      targetNumber: "",
      dailyTarget: 0,
      weeklyTarget: 0,
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
      targetNumber: "",
      dailyTarget: 0,
      weeklyTarget: 0,
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

  const calculateDistribution = (targetNumber: number) => {
    if (!targetNumber) return { daily: 0, weekly: 0 }
    const dailyTarget = Math.round((targetNumber / 84) * 100) / 100 // 84 days in 12 weeks
    const weeklyTarget = Math.round((targetNumber / 12) * 100) / 100 // 12 weeks
    return { daily: dailyTarget, weekly: weeklyTarget }
  }

  const handleTargetNumberChange = (value: string) => {
    const numValue = value ? Number.parseInt(value) : 0
    const distribution = calculateDistribution(numValue)
    setNewLongTermGoal((prev) => ({
      ...prev,
      targetNumber: value,
      dailyTarget: distribution.daily,
      weeklyTarget: distribution.weekly,
    }))
  }

  const addLongTermGoal = async () => {
    if (!newLongTermGoal.title || !newLongTermGoal.category) return

    const goalToCreate: Omit<LongTermGoal, "id" | "created_at" | "updated_at"> = {
      title: newLongTermGoal.title,
      description: newLongTermGoal.description || null,
      goal_type: selectedTimeframe as "1_year" | "5_year",
      completed: false,
      completed_at: null,
      target_count: newLongTermGoal.targetNumber ? Number.parseInt(newLongTermGoal.targetNumber) : undefined,
      daily_target: newLongTermGoal.dailyTarget || undefined,
      weekly_target: newLongTermGoal.weeklyTarget || undefined,
      current_progress: 0,
      agent_id: selectedAgentId,
      user_id: "", // Adding user_id field that Supabase RLS will populate - required for insert
    }

    try {
      console.log("[v0] Creating numeric goal:", {
        title: goalToCreate.title,
        targetNumber: newLongTermGoal.targetNumber,
        dailyTarget: newLongTermGoal.dailyTarget,
        weeklyTarget: newLongTermGoal.weeklyTarget,
      })

      const createdGoal = await createLongTermGoal(goalToCreate)

      if (!createdGoal) {
        console.error("[v0] Failed to create long-term goal - null returned")
        return
      }

      console.log("[v0] Goal created successfully:", createdGoal.id)

      setLongTermGoals((prev) => ({
        ...prev,
        [selectedTimeframe]: {
          ...prev[selectedTimeframe],
          [newLongTermGoal.category]: [...(prev[selectedTimeframe][newLongTermGoal.category] || []), createdGoal],
        },
      }))

      if (newLongTermGoal.targetNumber && createdGoal.id) {
        console.log("[v0] Starting task creation for numeric goal")
        await createTasksFromNumericGoal(createdGoal.id)
      }

      // Reset form
      setNewLongTermGoal({
        title: "",
        description: "",
        targetDate: "",
        category: "",
        notes: "",
        targetNumber: "",
        dailyTarget: 0,
        weeklyTarget: 0,
        milestones: [
          { title: "", targetDate: "" },
          { title: "", targetDate: "" },
          { title: "", targetDate: "" },
          { title: "", targetDate: "" },
        ],
      })
      setShowAddLongTermGoal(false)
    } catch (error) {
      console.error("[v0] Error adding long-term goal:", error)
    }
  }

  const createTasksFromNumericGoal = async (goalId: string) => {
    if (!newLongTermGoal.targetNumber || !selectedAgentId) return

    try {
      const supabase = createClient()
      const startDate = new Date()

      // Get the category_id from the selected category
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", newLongTermGoal.category)
        .eq("agent_id", selectedAgentId)
        .single()

      if (!categoryData?.id) {
        console.error("[v0] Category not found for numeric goal task creation")
        return
      }

      const dailyTasks = Array.from({ length: 84 }, (_, i) => {
        const taskDate = new Date(startDate)
        taskDate.setDate(taskDate.getDate() + i)
        return {
          title: `${newLongTermGoal.title} - Daily`,
          task_type: "daily",
          target_date: taskDate.toISOString().split("T")[0],
          linked_goal_id: goalId,
          counter: 0,
          completed: false,
          category_id: categoryData.id,
          agent_id: selectedAgentId,
          description: `Daily target: ${newLongTermGoal.dailyTarget}`,
        }
      })

      const weeklyTasks = Array.from({ length: 12 }, (_, i) => {
        const weekStart = new Date(startDate)
        weekStart.setDate(weekStart.getDate() + i * 7)
        return {
          title: `${newLongTermGoal.title} - Week ${i + 1}`,
          task_type: "weekly",
          target_date: weekStart.toISOString().split("T")[0],
          linked_goal_id: goalId,
          counter: 0,
          completed: false,
          category_id: categoryData.id,
          agent_id: selectedAgentId,
          description: `Weekly target: ${newLongTermGoal.weeklyTarget}`,
        }
      })

      // Insert all tasks
      const allTasks = [...dailyTasks, ...weeklyTasks]
      if (allTasks.length > 0) {
        const { error } = await supabase.from("tasks").insert(allTasks)
        if (error) {
          console.error("[v0] Error creating tasks:", error)
        } else {
          console.log(`[v0] Created ${allTasks.length} tasks for numeric goal ${goalId}`)
        }
      }
    } catch (error) {
      console.error("[v0] Error creating tasks from numeric goal:", error)
    }
  }

  return (
    <div>
      {/* Page content */}
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
        <Label htmlFor="lt-target-number">Target Number (Optional)</Label>
        <Input
          id="lt-target-number"
          type="number"
          placeholder="e.g., 100 (for 100 push-ups, 100 miles, etc.)"
          value={newLongTermGoal.targetNumber}
          onChange={(e) => handleTargetNumberChange(e.target.value)}
        />
      </div>
      {newLongTermGoal.targetNumber && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-blue-900">Prorated Distribution</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700 mb-1">Daily Target</p>
              <p className="text-lg font-semibold text-blue-900">{newLongTermGoal.dailyTarget}</p>
              <p className="text-xs text-blue-600">per day (÷ 84 days)</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 mb-1">Weekly Target</p>
              <p className="text-lg font-semibold text-blue-900">{newLongTermGoal.weeklyTarget}</p>
              <p className="text-xs text-blue-600">per week (÷ 12 weeks)</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 italic">
            Daily and weekly tasks will be created automatically with these targets
          </p>
        </div>
      )}
      <div>
        <Label>Milestones (Optional)</Label>
        <div className="space-y-3 mt-2">
          {newLongTermGoal.milestones.map((milestone, index) => (
            <div key={index}>
              <Label htmlFor={`milestone-title-${index}`}>Milestone {index + 1} Title</Label>
              <Input
                id={`milestone-title-${index}`}
                value={milestone.title}
                onChange={(e) =>
                  setNewLongTermGoal((prev) => ({
                    ...prev,
                    milestones: prev.milestones.map((m, i) => (i === index ? { ...m, title: e.target.value } : m)),
                  }))
                }
              />
              <Label htmlFor={`milestone-date-${index}`}>Milestone {index + 1} Target Date</Label>
              <Input
                id={`milestone-date-${index}`}
                type="date"
                value={milestone.targetDate}
                onChange={(e) =>
                  setNewLongTermGoal((prev) => ({
                    ...prev,
                    milestones: prev.milestones.map((m, i) => (i === index ? { ...m, targetDate: e.target.value } : m)),
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page

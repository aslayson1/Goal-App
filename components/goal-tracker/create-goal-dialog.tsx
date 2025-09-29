"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createGoal, type Category } from "@/lib/database/goals"
import { useAuth } from "@/components/auth/auth-provider"

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSuccess: () => void
}

export function CreateGoalDialog({ open, onOpenChange, categories, onSuccess }: CreateGoalDialogProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_count: 1,
    weekly_target: 1,
    category_id: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !formData.title || !formData.category_id) return

    setIsLoading(true)
    try {
      await createGoal({
        title: formData.title,
        description: formData.description,
        target_count: formData.target_count,
        current_progress: 0,
        weekly_target: formData.weekly_target,
        completed: false,
        completed_at: null,
        category_id: formData.category_id,
        user_id: user.id,
      })

      setFormData({
        title: "",
        description: "",
        target_count: 1,
        weekly_target: 1,
        category_id: "",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating goal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Goal</DialogTitle>
          <DialogDescription>Add a new goal to track your progress.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter goal title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Count</Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={formData.target_count}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, target_count: Number.parseInt(e.target.value) || 1 }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekly">Weekly Target</Label>
              <Input
                id="weekly"
                type="number"
                min="1"
                value={formData.weekly_target}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, weekly_target: Number.parseInt(e.target.value) || 1 }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

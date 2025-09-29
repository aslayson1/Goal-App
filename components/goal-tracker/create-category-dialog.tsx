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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCategory } from "@/lib/database/goals"
import { useAuth } from "@/components/auth/auth-provider"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const colorOptions = [
  { value: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Blue" },
  { value: "bg-green-500/20 text-green-400 border-green-500/30", label: "Green" },
  { value: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Purple" },
  { value: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "Orange" },
  { value: "bg-red-500/20 text-red-400 border-red-500/30", label: "Red" },
  { value: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Yellow" },
  { value: "bg-pink-500/20 text-pink-400 border-pink-500/30", label: "Pink" },
  { value: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", label: "Indigo" },
]

export function CreateCategoryDialog({ open, onOpenChange, onSuccess }: CreateCategoryDialogProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    color: colorOptions[0].value,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !formData.name) return

    setIsLoading(true)
    try {
      await createCategory({
        name: formData.name,
        color: formData.color,
        user_id: user.id,
      })

      setFormData({
        name: "",
        color: colorOptions[0].value,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Category</DialogTitle>
          <DialogDescription>Add a new category to organize your goals.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${option.value}`} />
                      <span>{option.label}</span>
                    </div>
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
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

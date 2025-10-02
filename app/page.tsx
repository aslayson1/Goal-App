"use client"

import { useState } from "react"

const Page = () => {
  const [goalsData, setGoalsData] = useState({})
  const [showDeleteGoal, setShowDeleteGoal] = useState(null)

  const deleteGoal = async (category: string, goalId: string) => {
    try {
      // Check if this is a database goal (has UUID format)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(goalId)

      if (isUUID) {
        // const { error } = await supabase.from("goals").delete().eq("id", goalId);
        // if (error) {
        //   console.error("Error deleting goal from database:", error);
        //   alert("Failed to delete goal from database. Please try again.");
        //   return;
        // }
      }

      // Update local state
      setGoalsData((prev) => ({
        ...prev,
        [category]: prev[category].filter((goal) => goal.id !== goalId),
      }))

      setShowDeleteGoal(null)
    } catch (error) {
      console.error("Error deleting goal:", error)
      // Show error to user but keep the dialog open
      alert("Failed to delete goal. Please try again.")
    }
  }

  return <div>{/* Page content here */}</div>
}

export default Page

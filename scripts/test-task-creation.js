// Test script to verify task creation works
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function testTaskCreation() {
  try {
    console.log("Testing task creation...")

    // Test creating a simple task
    const testTask = {
      id: crypto.randomUUID(),
      title: "Test Task - " + Date.now(),
      task_type: "daily",
      target_date: new Date().toISOString().split("T")[0],
      user_id: "00000000-0000-0000-0000-000000000001", // Demo user ID
      category_id: null,
      completed: false,
    }

    console.log("Attempting to insert task:", testTask)

    const { data, error } = await supabase.from("tasks").insert([testTask]).select()

    if (error) {
      console.error("Error creating test task:", error)
      return false
    }

    console.log("Successfully created test task:", data)

    // Verify it was saved
    const { data: savedTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", testTask.id)
      .single()

    if (fetchError) {
      console.error("Error fetching saved task:", fetchError)
      return false
    }

    console.log("Verified task was saved:", savedTask)
    return true
  } catch (error) {
    console.error("Test failed:", error)
    return false
  }
}

testTaskCreation()

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function checkTasks() {
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching tasks:", error)
      return
    }

    console.log("Recent tasks in database:")
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        console.log(`- ${task.title} (${task.task_type}) - Created: ${task.created_at}`)
      })
    } else {
      console.log("No tasks found in database")
    }
  } catch (err) {
    console.error("Script error:", err)
  }
}

checkTasks()

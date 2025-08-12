const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkTasks() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*&order=created_at.desc&limit=10`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Error fetching tasks:", response.status, response.statusText)
      return
    }

    const tasks = await response.json()

    console.log("Recent tasks in database:")
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        console.log(`- ${task.title} (${task.task_type}) - Created: ${task.created_at}`)
      })

      // Check specifically for the "Test" task
      const testTask = tasks.find((task) => task.title === "Test")
      if (testTask) {
        console.log("\n✅ Found 'Test' task in database!")
      } else {
        console.log("\n❌ 'Test' task not found in database")
      }
    } else {
      console.log("No tasks found in database")
    }
  } catch (err) {
    console.error("Script error:", err)
  }
}

checkTasks()

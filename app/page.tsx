import { createClient } from "supabase-js" // Assuming createClient is imported from supabase-js

export default async function Page() {
  const insertData = {
    title: "Sample Task",
    description: "This is a sample task description.",
    completed: false,
  }
  console.log("14. Insert data prepared:", insertData)

  console.log("15. Calling supabase.from('tasks').insert()...")
  const supabase = createClient("your-supabase-url", "your-supabase-key") // Replace with actual Supabase URL and key
  const { data, error } = await supabase.from("tasks").insert(insertData).select()

  console.log("16. Database response - data:", data)
  console.log("17. Database response - error:", error)

  if (error) {
    console.error("Error inserting data:", error)
  } else {
    console.log("Data inserted successfully:", data)
  }
}

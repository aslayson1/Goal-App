import fs from "fs"
import path from "path"

interface GoalData {
  id: string
  title: string
  description: string
  category: string
  progress: number
  created_at: string
}

export function analyzeGoalData() {
  console.log("🔍 Analyzing goal tracker data...")

  const dataPath = path.join(process.cwd(), "data", "goals.csv")

  if (!fs.existsSync(dataPath)) {
    console.log("❌ No goals data found. Run the CSV analyzer first.")
    return
  }

  const content = fs.readFileSync(dataPath, "utf-8")
  const lines = content.split("\n").filter((line) => line.trim())
  const headers = lines[0].split(",")

  console.log("📊 Data Structure:")
  console.log("Headers:", headers)
  console.log("Total records:", lines.length - 1)

  // Parse data
  const goals: GoalData[] = lines.slice(1).map((line) => {
    const values = line.split(",")
    return {
      id: values[0],
      title: values[1],
      description: values[2],
      category: values[3],
      progress: Number.parseInt(values[4]) || 0,
      created_at: values[5],
    }
  })

  // Analyze categories
  const categories = [...new Set(goals.map((g) => g.category))]
  console.log("📂 Categories:", categories)

  // Analyze progress
  const avgProgress = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
  console.log("📈 Average Progress:", Math.round(avgProgress) + "%")

  // Find goals by progress ranges
  const completed = goals.filter((g) => g.progress >= 100).length
  const inProgress = goals.filter((g) => g.progress > 0 && g.progress < 100).length
  const notStarted = goals.filter((g) => g.progress === 0).length

  console.log("✅ Completed:", completed)
  console.log("🔄 In Progress:", inProgress)
  console.log("⏳ Not Started:", notStarted)

  return {
    total: goals.length,
    categories,
    avgProgress,
    completed,
    inProgress,
    notStarted,
  }
}

// Run if called directly
if (require.main === module) {
  analyzeGoalData()
}

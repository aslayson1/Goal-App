// This script analyzes goal completion data and provides insights

interface GoalData {
  id: string
  title: string
  category: string
  type: string
  completed: boolean
  completionDate?: string
  target: number
  current: number
}

// Sample data for analysis
const sampleGoals: GoalData[] = [
  {
    id: '1',
    title: 'Daily Exercise',
    category: 'health',
    type: 'daily',
    completed: true,
    completionDate: '2024-01-15',
    target: 1,
    current: 1
  },
  {
    id: '2',
    title: 'Read Books',
    category: 'personal',
    type: 'monthly',
    completed: false,
    target: 2,
    current: 1
  },
  {
    id: '3',
    title: 'Save Money',
    category: 'financial',
    type: 'monthly',
    completed: false,
    target: 1000,
    current: 650
  }
]

function analyzeGoalData(goals: GoalData[]) {
  console.log('Analyzing goal tracker data...')

  const categoryStats = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = { total: 0, completed: 0 }
    }
    acc[goal.category].total++
    if (goal.completed) {
      acc[goal.category].completed++
    }
    return acc
  }, {} as Record<string, { total: number; completed: number }>)

  console.log('Goal completion rates by category:')
  Object.entries(categoryStats).forEach(([category, stats]) => {
    const rate = (stats.completed / stats.total * 100).toFixed(1)
    console.log(`${category}: ${stats.completed}/${stats.total} (${rate}%)`)
  })

  const overallCompleted = goals.reduce((sum, goal) => sum + (goal.completed ? 1 : 0), 0)
  const overallTotal = goals.length
  const overallRate = (overallCompleted / overallTotal * 100).toFixed(1)

  console.log(`\nOverall completion rate: ${overallCompleted}/${overallTotal} (${overallRate}%)`)
}

// Run the analysis
analyzeGoalData(sampleGoals)

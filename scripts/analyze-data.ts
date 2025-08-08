// Goal tracking data analysis script
console.log('Starting goal tracking data analysis...')

interface GoalData {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
  createdAt: string
  dueDate: string
}

// Mock goal data
const goals: GoalData[] = [
  {
    id: '1',
    title: 'Complete Marathon Training',
    description: 'Train for and complete a full marathon',
    category: 'Health & Fitness',
    priority: 'high',
    status: 'in-progress',
    progress: 65,
    createdAt: '2024-01-01',
    dueDate: '2024-06-01'
  },
  {
    id: '2',
    title: 'Learn TypeScript',
    description: 'Master TypeScript for better development',
    category: 'Professional Development',
    priority: 'medium',
    status: 'completed',
    progress: 100,
    createdAt: '2024-01-15',
    dueDate: '2024-03-15'
  },
  {
    id: '3',
    title: 'Save $10,000',
    description: 'Build emergency fund',
    category: 'Financial',
    priority: 'high',
    status: 'in-progress',
    progress: 40,
    createdAt: '2024-01-01',
    dueDate: '2024-12-31'
  },
  {
    id: '4',
    title: 'Read 24 Books',
    description: 'Read 2 books per month',
    category: 'Personal Growth',
    priority: 'medium',
    status: 'in-progress',
    progress: 33,
    createdAt: '2024-01-01',
    dueDate: '2024-12-31'
  }
]

// Analysis functions
function analyzeGoalsByStatus(goals: GoalData[]) {
  const statusCounts = goals.reduce((acc, goal) => {
    acc[goal.status] = (acc[goal.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('\n📊 Goals by Status:')
  console.log('==================')
  Object.entries(statusCounts).forEach(([status, count]) => {
    const percentage = Math.round((count / goals.length) * 100)
    console.log(`${status}: ${count} goals (${percentage}%)`)
  })
}

function analyzeGoalsByCategory(goals: GoalData[]) {
  const categoryData = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = { count: 0, avgProgress: 0, totalProgress: 0 }
    }
    acc[goal.category].count++
    acc[goal.category].totalProgress += goal.progress
    return acc
  }, {} as Record<string, { count: number; avgProgress: number; totalProgress: number }>)
  
  // Calculate average progress
  Object.keys(categoryData).forEach(category => {
    categoryData[category].avgProgress = Math.round(
      categoryData[category].totalProgress / categoryData[category].count
    )
  })
  
  console.log('\n📈 Goals by Category:')
  console.log('====================')
  Object.entries(categoryData).forEach(([category, data]) => {
    console.log(`${category}: ${data.count} goals (avg progress: ${data.avgProgress}%)`)
  })
}

function analyzeGoalsByPriority(goals: GoalData[]) {
  const priorityData = goals.reduce((acc, goal) => {
    if (!acc[goal.priority]) {
      acc[goal.priority] = { count: 0, completed: 0 }
    }
    acc[goal.priority].count++
    if (goal.status === 'completed') {
      acc[goal.priority].completed++
    }
    return acc
  }, {} as Record<string, { count: number; completed: number }>)
  
  console.log('\n🎯 Goals by Priority:')
  console.log('====================')
  Object.entries(priorityData).forEach(([priority, data]) => {
    const completionRate = Math.round((data.completed / data.count) * 100)
    console.log(`${priority}: ${data.count} goals (${data.completed} completed, ${completionRate}% rate)`)
  })
}

function calculateOverallProgress(goals: GoalData[]) {
  const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0)
  const averageProgress = Math.round(totalProgress / goals.length)
  const completedGoals = goals.filter(goal => goal.status === 'completed').length
  const completionRate = Math.round((completedGoals / goals.length) * 100)
  
  console.log('\n🏆 Overall Progress:')
  console.log('===================')
  console.log(`Total Goals: ${goals.length}`)
  console.log(`Completed Goals: ${completedGoals}`)
  console.log(`Completion Rate: ${completionRate}%`)
  console.log(`Average Progress: ${averageProgress}%`)
}

// Run analysis
console.log('Goal Tracking Analysis Report')
console.log('============================')

calculateOverallProgress(goals)
analyzeGoalsByStatus(goals)
analyzeGoalsByCategory(goals)
analyzeGoalsByPriority(goals)

console.log('\n✅ Analysis complete!')

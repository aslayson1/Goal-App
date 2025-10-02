// This script analyzes CSV data for goal tracking insights
console.log('Analyzing CSV data for goal tracking insights...')

// Mock CSV data analysis
const mockData = [
  { goal: 'Exercise', completed: 15, total: 20, category: 'Health' },
  { goal: 'Read Books', completed: 8, total: 12, category: 'Education' },
  { goal: 'Save Money', completed: 10, total: 10, category: 'Finance' },
  { goal: 'Learn Spanish', completed: 6, total: 15, category: 'Education' },
]

console.log('Goal Completion Analysis:')
console.log('========================')

mockData.forEach(item => {
  const percentage = Math.round((item.completed / item.total) * 100)
  console.log(`${item.goal}: ${item.completed}/${item.total} (${percentage}%)`)
})

const totalCompleted = mockData.reduce((sum, item) => sum + item.completed, 0)
const totalGoals = mockData.reduce((sum, item) => sum + item.total, 0)
const overallPercentage = Math.round((totalCompleted / totalGoals) * 100)

console.log('\nOverall Progress:')
console.log(`Total: ${totalCompleted}/${totalGoals} (${overallPercentage}%)`)

// Category analysis
const categories = mockData.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = { completed: 0, total: 0 }
  }
  acc[item.category].completed += item.completed
  acc[item.category].total += item.total
  return acc
}, {} as Record<string, { completed: number; total: number }>)

console.log('\nCategory Breakdown:')
Object.entries(categories).forEach(([category, data]) => {
  const percentage = Math.round((data.completed / data.total) * 100)
  console.log(`${category}: ${data.completed}/${data.total} (${percentage}%)`)
})

console.log('Analyzing CSV data for goal tracking...')

// Simulate CSV data analysis
const csvData = `
Category,Goal,Target,Current,Status
Business,Add agents,7,2,In Progress
Business,Newsletter,1,0,Not Started
Health,Run miles,120,32,On Track
Health,Workouts,60,18,On Track
Relationships,Date nights,6,2,Behind
`

console.log('Raw CSV data:')
console.log(csvData)

// Parse and analyze
const lines = csvData.trim().split('\n')
const headers = lines[0].split(',')
const data = lines.slice(1).map(line => {
  const values = line.split(',')
  return headers.reduce((obj, header, index) => {
    obj[header] = values[index]
    return obj
  }, {} as any)
})

console.log('\nParsed data:')
console.table(data)

// Analysis
const statusCounts = data.reduce((acc, row) => {
  acc[row.Status] = (acc[row.Status] || 0) + 1
  return acc
}, {} as Record<string, number>)

console.log('\nStatus distribution:')
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`${status}: ${count}`)
})

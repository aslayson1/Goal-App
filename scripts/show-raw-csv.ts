// Script to display raw CSV data for goal tracking
console.log('Displaying raw CSV data for goal tracking...')

// Mock CSV data as it would appear in a file
const csvData = `id,title,category,priority,status,progress,created_date,due_date
1,"Complete Marathon Training","Health & Fitness",high,in-progress,65,2024-01-01,2024-06-01
2,"Learn TypeScript","Professional Development",medium,completed,100,2024-01-15,2024-03-15
3,"Save $10000","Financial",high,in-progress,40,2024-01-01,2024-12-31
4,"Read 24 Books","Personal Growth",medium,in-progress,33,2024-01-01,2024-12-31
5,"Learn Spanish","Education",low,not-started,0,2024-02-01,2024-08-01
6,"Build Side Project","Professional Development",high,in-progress,75,2024-01-10,2024-04-10
7,"Lose 20 Pounds","Health & Fitness",medium,in-progress,50,2024-01-01,2024-07-01
8,"Visit 5 Countries","Travel",low,not-started,0,2024-03-01,2024-12-31`

console.log('\n📄 Raw CSV Data:')
console.log('================')
console.log(csvData)

// Parse and display formatted data
const lines = csvData.split('\n')
const headers = lines[0].split(',')
const rows = lines.slice(1).map(line => line.split(','))

console.log('\n📋 Parsed Data:')
console.log('===============')

// Display headers
console.log(headers.join(' | '))
console.log('-'.repeat(headers.join(' | ').length))

// Display rows
rows.forEach(row => {
  console.log(row.join(' | '))
})

// Basic statistics
console.log('\n📊 Quick Statistics:')
console.log('===================')
console.log(`Total records: ${rows.length}`)
console.log(`Data fields: ${headers.length}`)

// Count by status
const statusCounts = rows.reduce((acc, row) => {
  const status = row[4] // status column
  acc[status] = (acc[status] || 0) + 1
  return acc
}, {} as Record<string, number>)

console.log('\nStatus distribution:')
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`)
})

console.log('\n✅ Raw data display complete!')

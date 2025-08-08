console.log('Raw CSV data from goal tracker:')

const rawCsvData = `
ID,Category,Title,Description,Target,Current,Weekly_Target,Notes
lg1,Layson Group,Add 3 agents to Memphis & Nashville and 2 to Knoxville,Expand team across key Tennessee markets,7,2,0.6,Focus on experienced agents with local market knowledge
lg2,Layson Group,Create automated newsletter,Build automated email marketing system,1,0,0.08,Need to set up email templates and automation workflows
up1,Upside,Get 100 paid users for Upside,Reach 100 paying customers milestone,100,15,8.3,Current conversion rate is 8% need to improve onboarding
rf1,Relationships/Family,Take Sarah out on 6 dates,Quality time with spouse - planned date nights,6,2,0.5,Planned dinner and movie night need to schedule more
pnh1,Physical/Nutrition/Health,Run/Walk/Ruck 120 Miles,Complete 120 miles of cardio exercise,120,32,10,Averaging 8 miles per week on track
sc1,Spiritual/Contribution,Go to Church 10 Times,Regular church attendance,10,3,0.8,Sunday services family enjoys the community
ie1,Intellect/Education,Review Goals 60 Times,Daily goal review and reflection,60,22,5,Morning review routine established
la1,Lifestyle/Adventure,Schedule 1 short weekend Trip,Plan and execute weekend getaway,1,0,0.08,Looking at Nashville or Gatlinburg options
pfm1,Personal Finance/Material,Buy 1st Tax Sale Property,Purchase first property at tax sale,1,0,0.08,Researching properties and auction process
`

console.log(rawCsvData)

// Basic statistics
const lines = rawCsvData.trim().split('\n')
const dataRows = lines.slice(1).filter(line => line.trim())

console.log(`\nTotal goals: ${dataRows.length}`)

// Calculate completion rates
let totalProgress = 0
let totalTargets = 0

dataRows.forEach(line => {
  const columns = line.split(',')
  const current = parseInt(columns[5]) || 0
  const target = parseInt(columns[4]) || 1
  
  totalProgress += current / target
  totalTargets += 1
})

const overallCompletion = (totalProgress / totalTargets * 100).toFixed(1)
console.log(`Overall completion rate: ${overallCompletion}%`)

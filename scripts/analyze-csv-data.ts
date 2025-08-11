import fs from "fs"
import path from "path"

// This script analyzes CSV data for the goal tracker application
export function analyzeCsvData() {
  console.log("Analyzing CSV data...")

  // Check if data directory exists
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    console.log("No data directory found. Creating sample data structure...")
    fs.mkdirSync(dataDir, { recursive: true })

    // Create sample CSV structure
    const sampleData = `id,title,description,category,progress,created_at
1,Learn TypeScript,Master TypeScript fundamentals,Learning,75,2024-01-01
2,Build Portfolio,Create a professional portfolio website,Career,50,2024-01-02
3,Exercise Daily,Maintain daily exercise routine,Health,90,2024-01-03`

    fs.writeFileSync(path.join(dataDir, "goals.csv"), sampleData)
    console.log("Sample goals.csv created")
  }

  // Analyze existing data
  const csvFiles = fs.readdirSync(dataDir).filter((file) => file.endsWith(".csv"))
  console.log(`Found ${csvFiles.length} CSV files:`, csvFiles)

  csvFiles.forEach((file) => {
    const filePath = path.join(dataDir, file)
    const content = fs.readFileSync(filePath, "utf-8")
    const lines = content.split("\n").filter((line) => line.trim())
    console.log(`${file}: ${lines.length - 1} data rows (excluding header)`)
  })
}

// Run if called directly
if (require.main === module) {
  analyzeCsvData()
}

import fs from "fs"
import path from "path"

// Show raw CSV content
const csvPath = path.join(process.cwd(), "data", "sample.csv")

if (fs.existsSync(csvPath)) {
  const csvContent = fs.readFileSync(csvPath, "utf-8")
  console.log("📄 Raw CSV Content:")
  console.log("=".repeat(50))
  console.log(csvContent)
  console.log("=".repeat(50))
} else {
  console.log("❌ CSV file not found at:", csvPath)
  console.log("Creating sample CSV...")

  const sampleCsv = `name,progress,category,created_date
Learn React,75,Education,2024-01-15
Exercise Daily,60,Health,2024-01-10
Read 12 Books,25,Personal,2024-01-01
Save Money,80,Finance,2024-01-05`

  fs.mkdirSync(path.dirname(csvPath), { recursive: true })
  fs.writeFileSync(csvPath, sampleCsv)
  console.log("✅ Sample CSV created at:", csvPath)
}

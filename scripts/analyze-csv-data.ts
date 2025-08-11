import fs from "fs"
import path from "path"

// Read and analyze CSV data
const csvPath = path.join(process.cwd(), "data", "sample.csv")

if (fs.existsSync(csvPath)) {
  const csvContent = fs.readFileSync(csvPath, "utf-8")
  const lines = csvContent.split("\n").filter((line) => line.trim())

  console.log("📊 CSV Analysis:")
  console.log(`Total rows: ${lines.length}`)
  console.log(`Headers: ${lines[0]}`)
  console.log(`Sample data: ${lines.slice(1, 4).join("\n")}`)
} else {
  console.log("❌ CSV file not found at:", csvPath)
}

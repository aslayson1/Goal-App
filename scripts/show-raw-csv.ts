import fs from "fs"
import path from "path"

export function showRawCsv() {
  console.log("📄 Raw CSV Data Preview")
  console.log("=".repeat(50))

  const dataDir = path.join(process.cwd(), "data")

  if (!fs.existsSync(dataDir)) {
    console.log("❌ No data directory found")
    return
  }

  const csvFiles = fs.readdirSync(dataDir).filter((file) => file.endsWith(".csv"))

  if (csvFiles.length === 0) {
    console.log("❌ No CSV files found in data directory")
    return
  }

  csvFiles.forEach((file) => {
    console.log(`\n📁 File: ${file}`)
    console.log("-".repeat(30))

    const filePath = path.join(dataDir, file)
    const content = fs.readFileSync(filePath, "utf-8")

    // Show first 10 lines
    const lines = content.split("\n")
    const preview = lines.slice(0, Math.min(10, lines.length))

    preview.forEach((line, index) => {
      if (line.trim()) {
        console.log(`${index + 1}: ${line}`)
      }
    })

    if (lines.length > 10) {
      console.log(`... and ${lines.length - 10} more lines`)
    }
  })
}

// Run if called directly
if (require.main === module) {
  showRawCsv()
}

import { execSync } from "child_process"

export function installAndCommit() {
  console.log("📦 Installing dependencies...")

  try {
    // Install dependencies
    execSync("npm install", { stdio: "inherit" })
    console.log("✅ Dependencies installed successfully")

    // Check git status
    try {
      const status = execSync("git status --porcelain", { encoding: "utf-8" })
      if (status.trim()) {
        console.log("📝 Changes detected, committing...")

        // Add all changes
        execSync("git add .", { stdio: "inherit" })

        // Commit changes
        execSync('git commit -m "chore: install dependencies and update project"', { stdio: "inherit" })
        console.log("✅ Changes committed successfully")
      } else {
        console.log("ℹ️ No changes to commit")
      }
    } catch (gitError) {
      console.log("ℹ️ Git not initialized or no changes to commit")
    }
  } catch (error) {
    console.error("❌ Error during installation:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  installAndCommit()
}

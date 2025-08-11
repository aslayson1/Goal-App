import { execSync } from "child_process"

try {
  console.log("Installing dependencies...")
  execSync("pnpm install", { stdio: "inherit" })

  console.log("Committing changes...")
  execSync("git add .", { stdio: "inherit" })
  execSync('git commit -m "fix: use @supabase/ssr for browser client and auth-helpers for server"', {
    stdio: "inherit",
  })

  console.log("✅ Dependencies installed and changes committed successfully!")
} catch (error) {
  console.error("❌ Error:", error)
  process.exit(1)
}

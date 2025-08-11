import { execSync } from "child_process"

try {
  console.log("Installing dependencies...")
  execSync("pnpm install", { stdio: "inherit" })

  console.log("Committing changes...")
  execSync("git add .", { stdio: "inherit" })
  execSync('git commit -m "fix: standardize Supabase to @supabase/ssr + add ping route"', { stdio: "inherit" })

  console.log("✅ Successfully updated Supabase setup and committed changes")
} catch (error) {
  console.error("❌ Error:", error)
  process.exit(1)
}

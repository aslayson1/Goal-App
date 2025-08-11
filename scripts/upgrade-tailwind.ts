import { execSync } from "child_process"

console.log("🔄 Installing dependencies...")
execSync("pnpm install", { stdio: "inherit" })

console.log("📝 Adding changes to git...")
execSync("git add .", { stdio: "inherit" })

console.log("💾 Committing changes...")
execSync('git commit -m "fix: upgrade to Tailwind v4 and align PostCSS config"', { stdio: "inherit" })

console.log("🚀 Pushing to main branch...")
execSync("git push origin main", { stdio: "inherit" })

console.log("✅ Tailwind v4 upgrade complete!")

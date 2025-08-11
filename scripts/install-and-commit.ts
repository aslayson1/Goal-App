import { execSync } from "child_process"

console.log("Installing dependencies with pnpm...")
execSync("pnpm install", { stdio: "inherit" })

console.log("Adding changes to git...")
execSync("git add .", { stdio: "inherit" })

console.log("Committing changes...")
execSync('git commit -m "fix: add tw-animate-css dependency"', { stdio: "inherit" })

console.log("Pushing to main...")
execSync("git push origin main", { stdio: "inherit" })

console.log("✅ Successfully added tw-animate-css dependency and pushed to main!")

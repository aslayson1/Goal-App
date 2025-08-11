import { execSync } from "child_process"

try {
  execSync("git add postcss.config.mjs", { stdio: "inherit" })
  execSync('git commit -m "fix: remove autoprefixer from PostCSS config for Tailwind v4"', { stdio: "inherit" })
  console.log("✅ Successfully committed PostCSS config changes")
} catch (error) {
  console.error("❌ Error committing changes:", error)
}

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

console.log("🚀 Upgrading to Tailwind CSS v4...")

// Update package.json
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

// Update Tailwind CSS to v4
packageJson.devDependencies = {
  ...packageJson.devDependencies,
  tailwindcss: "^4.0.0-alpha.1",
  "@tailwindcss/postcss": "^4.0.0-alpha.1",
}

// Remove old Tailwind config dependencies
delete packageJson.devDependencies["@tailwindcss/typography"]
delete packageJson.devDependencies["@tailwindcss/forms"]

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

// Update PostCSS config
const postcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
`

fs.writeFileSync(path.join(process.cwd(), "postcss.config.mjs"), postcssConfig)

// Update globals.css to use @import instead of @tailwind
const globalsPath = path.join(process.cwd(), "app", "globals.css")
let globalsContent = fs.readFileSync(globalsPath, "utf-8")

globalsContent = globalsContent.replace(
  "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
  '@import "tailwindcss";\n@import "tailwindcss/theme" theme(reference);',
)

fs.writeFileSync(globalsPath, globalsContent)

console.log("✅ Tailwind CSS v4 configuration updated!")
console.log("📦 Installing dependencies...")

try {
  execSync("pnpm install", { stdio: "inherit" })
  console.log("✅ Dependencies installed successfully!")
} catch (error) {
  console.error("❌ Error installing dependencies:", error)
}

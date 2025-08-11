import { execSync } from "child_process"
import fs from "fs"
import path from "path"

export function upgradeTailwind() {
  console.log("🔄 Upgrading to Tailwind CSS v4...")

  try {
    // Update package.json
    const packageJsonPath = path.join(process.cwd(), "package.json")
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

    // Update Tailwind dependencies
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      tailwindcss: "^4.1.9",
      "@tailwindcss/postcss": "^4.1.9",
    }

    // Remove old Tailwind v3 dependencies if they exist
    delete packageJson.devDependencies["autoprefixer"]

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("✅ Updated package.json")

    // Update PostCSS config
    const postcssConfig = `export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}`

    fs.writeFileSync(path.join(process.cwd(), "postcss.config.mjs"), postcssConfig)
    console.log("✅ Updated PostCSS config")

    // Update globals.css
    const globalsPath = path.join(process.cwd(), "app", "globals.css")
    let globalsContent = fs.readFileSync(globalsPath, "utf-8")

    // Replace @tailwind directives with @import
    globalsContent = globalsContent.replace(/@tailwind base;/g, "")
    globalsContent = globalsContent.replace(/@tailwind components;/g, "")
    globalsContent = globalsContent.replace(/@tailwind utilities;/g, "")

    // Add imports at the top if not present
    if (!globalsContent.includes('@import "tailwindcss"')) {
      globalsContent = '@import "tailwindcss";\n@import "tw-animate-css";\n\n' + globalsContent
    }

    fs.writeFileSync(globalsPath, globalsContent)
    console.log("✅ Updated globals.css")

    // Install dependencies
    console.log("📦 Installing updated dependencies...")
    execSync("npm install", { stdio: "inherit" })

    console.log("🎉 Tailwind CSS v4 upgrade complete!")
  } catch (error) {
    console.error("❌ Error upgrading Tailwind:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  upgradeTailwind()
}

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("Running postinstall script...")

try {
  console.log("Generating Prisma Client...")
  execSync("npx prisma generate", { stdio: "inherit" })
} catch (e) {
  console.error("Prisma generate warning/error:", e.message)
}

// Copy query engine to match any OpenSSL 3.x variant on Linux (e.g. rhel-openssl-3.5.x)
const searchDirs = [
  path.join(__dirname, "../node_modules/.prisma/client"),
  path.join(__dirname, "../node_modules/@prisma/client"),
]

searchDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return
  try {
    const files = fs.readdirSync(dir)
    const rhel30 = files.find((f) => f.includes("rhel-openssl-3.0.x"))
    if (rhel30) {
      const src = path.join(dir, rhel30)
      ;["rhel-openssl-3.5.x", "rhel-openssl-3.2.x", "rhel-openssl-3.1.x"].forEach((target) => {
        const dest = path.join(dir, rhel30.replace("rhel-openssl-3.0.x", target))
        if (!fs.existsSync(dest)) {
          fs.copyFileSync(src, dest)
          console.log(`Created compatibility copy: ${dest}`)
        }
      })
    }
  } catch (err) {
    console.error(`Error in postinstall compatibility mapping for ${dir}:`, err.message)
  }
})

console.log("Postinstall completed successfully.")

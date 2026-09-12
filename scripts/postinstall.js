const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("==> Running custom Prisma compatibility setup...")

// 1. Patch all Prisma OpenSSL 3.x detections to resolve to 3.0.x
function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return
  try {
    let content = fs.readFileSync(filePath, "utf8")
    const re = /return\s+([a-zA-Z0-9_$]+\[1\])\s*\+\s*["']\.x["']/g
    if (re.test(content)) {
      content = content.replace(
        re,
        'return ($1 && String($1).startsWith("3.") ? "3.0.x" : $1 + ".x")'
      )
      fs.writeFileSync(filePath, content, "utf8")
      console.log(`Patched OpenSSL 3.x detection in: ${filePath}`)
    }
  } catch (err) {
    console.warn(`Could not patch ${filePath}:`, err.message)
  }
}

function walkAndPatch(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkAndPatch(fullPath)
    } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".cjs"))) {
      patchFile(fullPath)
    }
  }
}

const targetDirs = [
  path.join(__dirname, "../node_modules/prisma"),
  path.join(__dirname, "../node_modules/@prisma"),
]

for (const dir of targetDirs) {
  walkAndPatch(dir)
}

// 2. Set environment variables for Prisma CLI
process.env.PRISMA_CLI_BINARY_TARGETS = "rhel-openssl-3.0.x,debian-openssl-3.0.x"

// 3. Generate Prisma Client
try {
  console.log("==> Generating Prisma Client...")
  execSync("npx prisma generate", {
    stdio: "inherit",
    env: {
      ...process.env,
      PRISMA_CLI_BINARY_TARGETS: "rhel-openssl-3.0.x,debian-openssl-3.0.x",
    },
  })
} catch (e) {
  console.error("Prisma generate error:", e.message)
  process.exit(1)
}

// 4. Create compatibility copies for any potential OpenSSL version mismatches
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
    console.error(`Error in compatibility copy for ${dir}:`, err.message)
  }
})

console.log("==> Prisma compatibility setup finished successfully!")

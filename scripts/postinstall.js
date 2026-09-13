const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("==> Running custom Prisma compatibility setup...")

process.env.PRISMA_HIDE_UPDATE_MESSAGE = "true"

// 1. Patch all Prisma OpenSSL 3.x detections and repeat(-2) crash
function patchFile(filePath) {
  if (!fs.existsSync(filePath)) return
  try {
    let content = fs.readFileSync(filePath, "utf8")
    let modified = false

    // Fix OpenSSL 3.x detection to use 3.0.x
    const reOpenSSL = /return\s+([a-zA-Z0-9_$]+\[1\])\s*\+\s*["']\.x["']/g
    if (reOpenSSL.test(content)) {
      content = content.replace(
        reOpenSSL,
        'return ($1 && String($1).startsWith("3.") ? "3.0.x" : $1 + ".x")'
      )
      modified = true
    }

    // Fix drawBox repeat negative count crash
    if (content.includes("chars.horizontal.repeat(width - title.length - 2 - 3)")) {
      content = content.replace(
        "chars.horizontal.repeat(width - title.length - 2 - 3)",
        "chars.horizontal.repeat(Math.max(0, width - title.length - 2 - 3))"
      )
      modified = true
    }
    if (content.includes("chars.horizontal.repeat(width - 2)")) {
      content = content.replace(
        "chars.horizontal.repeat(width - 2)",
        "chars.horizontal.repeat(Math.max(0, width - 2))"
      )
      modified = true
    }

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8")
      console.log(`Patched: ${filePath}`)
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

// 2. Generate Prisma Client
try {
  console.log("==> Generating Prisma Client...")
  execSync("npx prisma generate", {
    stdio: "inherit",
    env: {
      ...process.env,
      PRISMA_HIDE_UPDATE_MESSAGE: "true",
    },
  })
} catch (e) {
  console.warn("Prisma generate exited with notice:", e.message)
  const clientExists = fs.existsSync(
    path.join(__dirname, "../node_modules/.prisma/client/index.js")
  )
  if (!clientExists) {
    console.error("Prisma client was not generated!")
    process.exit(1)
  }
}

console.log("==> Prisma compatibility setup finished successfully!")

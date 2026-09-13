import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

if (!process.env.SESSION_SECRET_KEY || process.env.SESSION_SECRET_KEY.length < 32) {
  process.env.SESSION_SECRET_KEY =
    process.env.SESSION_SECRET_KEY ||
    "f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
}

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "getitdone",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  images: {
    domains: ["images.unsplash.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = config

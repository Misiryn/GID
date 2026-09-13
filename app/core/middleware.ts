import { sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import db from "db"

if (!process.env.SESSION_SECRET_KEY || process.env.SESSION_SECRET_KEY.length < 32) {
  process.env.SESSION_SECRET_KEY =
    process.env.SESSION_SECRET_KEY ||
    "f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
}

export const authMiddleware = sessionMiddleware({
  cookiePrefix: "getitdone",
  isAuthorized: simpleRolesIsAuthorized,
  getSession: (handle) => db.session.findFirst({ where: { handle } }),
  getSessions: (userId) => db.session.findMany({ where: { userId } }),
  createSession: (session) => {
    let user
    if (session.userId) {
      user = { connect: { id: session.userId } }
    }
    return db.session.create({
      data: { ...session, userId: undefined, user },
    })
  },
  updateSession: async (handle, session) => {
    try {
      return await db.session.update({ where: { handle }, data: session })
    } catch (error: any) {
      if (error?.code === "P2016") {
        return null as any
      }
      throw error
    }
  },
  deleteSession: (handle) => db.session.delete({ where: { handle } }),
})

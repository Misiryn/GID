import { sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import db from "db"

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

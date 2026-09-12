import { resolver } from "blitz"
import db from "db"
import { authMiddleware } from "app/core/middleware"

export const middleware = [authMiddleware]

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      action,
      id,
      data,
    }: {
      action: "update" | "delete"
      id?: number
      data?: any
    },
    ctx
  ) => {
    if (action === "update") {
      const targetId = id || ctx.session.userId
      return db.user.update({ where: { id: targetId }, data })
    }
    if (action === "delete") {
      if (ctx.session.role !== "ADMIN") throw new Error("Unauthorized")
      return db.user.delete({ where: { id } })
    }
  }
)

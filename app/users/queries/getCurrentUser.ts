import { Ctx } from "blitz"
import db from "db"
import { authMiddleware } from "app/core/middleware"

export const middleware = [authMiddleware]

export default async function getCurrentUser(_ = null, ctx: Ctx) {
  if (!ctx?.session?.userId) return null

  const user = await db.user.findFirst({
    where: { id: ctx.session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  return user
}

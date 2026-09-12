import { Ctx } from "blitz"
import { authMiddleware } from "app/core/middleware"

export const middleware = [authMiddleware]

export default async function logout(_: any, ctx: Ctx) {
  if (!ctx?.session) return true
  return await ctx.session.$revoke()
}

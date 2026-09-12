import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"
import { authMiddleware } from "app/core/middleware"

export const middleware = [authMiddleware]

interface GetUsersInput
  extends Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(async (input: GetUsersInput = {}) => {
  const { where, orderBy, skip = 0, take = 100 } = input || {}
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const {
    items: users,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () => db.user.count({ where }),
    query: (paginateArgs) => db.user.findMany({ ...paginateArgs, where, orderBy }),
  })

  return {
    users,
    nextPage,
    hasMore,
    count,
  }
})

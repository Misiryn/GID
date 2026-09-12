import { paginate, resolver, NotFoundError } from "blitz"
import db, { Prisma } from "db"

interface GetServicesInput
  extends Pick<Prisma.ServiceFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  id?: number
}

export default resolver.pipe(
  async ({ id, where, orderBy, skip = 0, take = 100 }: GetServicesInput) => {
    if (id) {
      const service = await db.service.findFirst({
        where: { id },
        include: { category: true },
      })
      if (!service) throw new NotFoundError()
      return service as any
    }

    const {
      items: services,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.service.count({ where }),
      query: (paginateArgs) =>
        db.service.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            category: true,
          },
        }),
    })

    return {
      services,
      nextPage,
      hasMore,
      count,
    } as any
  }
)

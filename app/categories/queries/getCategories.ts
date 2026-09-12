import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(async () => {
  const categories = await db.category.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: {
        select: { services: true },
      },
    },
  })
  return categories
})

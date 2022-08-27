import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteUser = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteUser),
  resolver.authorize(["ADMIN"]),
  async ({ id }) => {
    await db.service.deleteMany({
      where: {
        createdBy: {
          id,
        },
      },
    })

    await db.order.deleteMany({
      where: {
        createdBy: {
          id,
        },
      },
    })

    const user = await db.user.delete({ where: { id } })

    return user
  }
)

import { resolver } from "blitz"
import db from "db"
import { CreateService } from "../validation"

export default resolver.pipe(
  resolver.zod(CreateService),
  resolver.authorize(),
  async ({ createdBy, ...input }) => {
    console.log(input)
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const service = await db.service.create({
      data: {
        ...input,
        createdBy: {
          connect: {
            id: createdBy,
          },
        },
      },
      select: {
        id: true,
      },
    })

    return service
  }
)

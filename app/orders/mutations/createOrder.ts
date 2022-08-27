import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateOrder = z.object({
  service: z.number(),
  serviceDateTime: z.date(),
  createdBy: z.number(),
  total: z.number(),
  isCompleted: z.boolean(),
  address: z.string(),
  is_paid: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(CreateOrder),
  resolver.authorize(),
  async ({ createdBy, service, ...input }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const order = await db.order.create({
      data: {
        createdBy: {
          connect: {
            id: createdBy,
          },
        },
        service: {
          connect: {
            id: service,
          },
        },
        ...input,
      },
    })

    return order
  }
)

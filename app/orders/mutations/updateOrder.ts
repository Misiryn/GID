import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { CreateOrder } from "./createOrder"

const UpdateOrder = CreateOrder.merge(
  z.object({
    id: z.number(),
  })
).omit({ createdBy: true, service: true })

export default resolver.pipe(
  resolver.zod(UpdateOrder),
  resolver.authorize("ADMIN"),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const order = await db.order.update({ where: { id }, data })

    return order
  }
)

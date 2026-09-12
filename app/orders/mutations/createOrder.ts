import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateOrder = z.object({
  service: z.number(),
  serviceDateTime: z.date(),
  createdBy: z.number(),
  total: z.number(),
  isCompleted: z.boolean().default(false),
  address: z.string(),
  is_paid: z.boolean().default(false),
  timeSlot: z.string().optional(),
  status: z.string().optional(),
  partnerName: z.string().optional(),
  partnerRating: z.number().optional(),
  paymentMethod: z.string().optional(),
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
        timeSlot: input.timeSlot || "09:00 AM - 11:00 AM",
        status: input.status || "CONFIRMED",
        partnerName: input.partnerName || "Verified Professional",
        partnerRating: input.partnerRating || 4.9,
        paymentMethod: input.paymentMethod || "PAY_AFTER_SERVICE",
        ...input,
      },
    })

    return order
  }
)

import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { CreateService } from "../validation"

const UpdateService = CreateService.merge(
  z.object({
    id: z.number(),
  })
).omit({ createdBy: true })

export default resolver.pipe(
  resolver.zod(UpdateService),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const service = await db.service.update({ where: { id }, data })

    return service
  }
)

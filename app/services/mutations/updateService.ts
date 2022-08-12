import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateService = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateService),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const service = await db.service.update({ where: { id }, data })

    return service
  }
)

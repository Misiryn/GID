import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(
  resolver.authorize("ADMIN"),
  async ({
    action,
    id,
    data,
  }: {
    action: "create" | "update" | "delete"
    id?: number
    data?: any
  }) => {
    if (action === "create") {
      return db.service.create({ data })
    }
    if (action === "update") {
      return db.service.update({ where: { id }, data })
    }
    if (action === "delete") {
      return db.service.delete({ where: { id } })
    }
  }
)

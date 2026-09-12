import { resolver } from "blitz"
import db from "db"
import StripeConstructor from "stripe"
import { authMiddleware } from "app/core/middleware"

export const middleware = [authMiddleware]

const stripe = new StripeConstructor(
  "sk_test_51Gw3jiEnwVW1SW8r1KnmeTfRNkNWJOFOfnOGIfLjvzeTBTLkJx7g2CE4jGQiSBSTGcTRKskkemuXqQxKkHggrBxK00b1aB0HWn",
  { apiVersion: "2022-08-01" }
)

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      action,
      id,
      data,
    }: {
      action: "create" | "update" | "delete" | "stripe"
      id?: number
      data?: any
    },
    ctx
  ) => {
    if (action === "stripe") {
      const { total, token } = data
      const user = await db.user.findFirst({ where: { id: ctx.session.userId } })
      return (
        user &&
        (await stripe.charges.create({
          amount: total * 100,
          currency: "inr",
          source: token,
          description: `GetItDone | User Id ${user.id} | `,
        }))
      )
    }

    if (action === "create") {
      const userId = ctx.session.userId
      const { service, ...orderData } = data
      return db.order.create({
        data: {
          ...orderData,
          user: { connect: { id: userId } },
          service: { connect: { id: service } },
        },
      })
    }

    if (action === "update") {
      return db.order.update({ where: { id }, data })
    }

    if (action === "delete") {
      return db.order.delete({ where: { id } })
    }
  }
)

import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import StripeConstructor from "stripe"

const stripe = new StripeConstructor(
  "sk_test_51Gw3jiEnwVW1SW8r1KnmeTfRNkNWJOFOfnOGIfLjvzeTBTLkJx7g2CE4jGQiSBSTGcTRKskkemuXqQxKkHggrBxK00b1aB0HWn",
  { apiVersion: "2022-08-01" }
)

const Stripe = z.object({
  total: z.number(),
  token: z.string(),
})

export default resolver.pipe(resolver.zod(Stripe), resolver.authorize(), async (input, ctx) => {
  const { total } = input
  const user = await db.user.findFirst({ where: { id: ctx.session.userId } })

  const charge =
    user &&
    (await stripe.charges.create({
      amount: total * 100,
      currency: "inr",
      source: input.token,
      description: `GetItDone | User Id ${user.id} | `,
    }))

  return charge
})

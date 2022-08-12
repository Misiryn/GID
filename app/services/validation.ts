import { z } from "zod"

export const title = z.string().min(3).max(50)

export const slug = z.string().min(3).max(50)

export const details = z.string().min(3).max(5000)

export const price = z.number().min(3)

export const coverImage = z.string().min(3).url()

export const createdBy = z.number()

export const CreateService = z.object({
  title,
  slug,
  details,
  coverImage,
  price,
  offerPrice: price,
  createdBy,
})

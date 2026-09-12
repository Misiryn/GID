import { z } from "zod"

export const title = z.string().min(3).max(50)

export const slug = z.string().min(3).max(50)

export const details = z.string().min(3).max(5000)

export const price = z.number().min(3)

export const coverImage = z
  .string()
  .min(3)
  .url()
  .refine(
    (val) => !val.match(/^https?:\/\/(www\.)?unsplash\.com\/photos\//i),
    {
      message:
        "Please provide a direct image address (right-click the photo on Unsplash and select 'Copy Image Address', starting with https://images.unsplash.com/...), not the Unsplash webpage URL.",
    }
  )
  .refine(
    (val) => !val.match(/^https?:\/\/(www\.)?istockphoto\.com\/photos\//i),
    {
      message:
        "Please provide a direct image address, not the iStockphoto webpage URL.",
    }
  )

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

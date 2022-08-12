import { Textarea } from "@nextui-org/react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextArea } from "app/core/components/LabeledTextArea"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ServiceForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField type="text" name="title" label="Title" placeholder="title" />
      <LabeledTextField type="text" name="slug" label="Slug" placeholder="slug" />
      <LabeledTextArea name="details" label="Details" placeholder="details" />
      <LabeledTextField type="number" name="price" label="Price" placeholder="price" min={0} />
      <LabeledTextField
        type="number"
        name="offerPrice"
        label="Offer Price"
        placeholder="offerPrice"
        min={0}
      />
      <LabeledTextField name="coverImage" label="Cover Image" placeholder="URL of cover image" />
    </Form>
  )
}

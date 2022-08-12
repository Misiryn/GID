import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikProps } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"
import { Button } from "@nextui-org/react"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>["initialValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null)
  return (
    <Formik
      initialValues={initialValues || {}}
      validate={validateZodSchema(schema)}
      enableReinitialize
      onSubmit={async (values, { setErrors }) => {
        console.log(values)
        const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {}

        if (FORM_ERROR) {
          setFormError(FORM_ERROR)
        }

        if (Object.keys(otherErrors).length > 0) {
          setErrors(otherErrors)
        }
      }}
    >
      {({ handleSubmit, isSubmitting, errors }) => {
        console.log(errors)

        return (
          <form onSubmit={handleSubmit} className="form" {...props}>
            {/* Form fields supplied as children are rendered here */}
            {children}

            {formError && (
              <div role="alert" style={{ color: "red" }}>
                {formError}
              </div>
            )}

            {submitText && (
              <Button
                type="submit"
                disabled={isSubmitting}
                css={{ width: "100%", display: "block", my: "$8" }}
              >
                {submitText}
              </Button>
            )}

            <style global jsx>{`
              .form {
                width: 100%;
              }
              .form > * + * {
                margin-top: 0.5rem;
              }
            `}</style>
          </form>
        )
      }}
    </Formik>
  )
}

export default Form

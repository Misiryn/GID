import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { Textarea } from "@nextui-org/react"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextArea = forwardRef<HTMLTextAreaElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div {...outerProps}>
        {/* @ts-ignore */}
        <Textarea label={label} fullWidth {...input} disabled={isSubmitting} {...props} ref={ref} />

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" style={{ color: "red" }}>
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

export default LabeledTextArea

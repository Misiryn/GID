import { useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { Card, Spacer, Text } from "@nextui-org/react"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <Card
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "500px",
        p: "2rem",
        mx: "auto",
        mt: "2rem",
        bg: "#000",
      }}
    >
      <Text h2 css={{ mb: "$8" }}>
        Create an Account
      </Text>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "", name: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField name="name" label="Name" placeholder="Name" />
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <Spacer y={1} />
      </Form>
    </Card>
  )
}

export default SignupForm

import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { Card, Link as StyleLink, Spacer } from "@nextui-org/react"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Button, Text } from "@nextui-org/react"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

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
        Login
      </Text>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <Spacer y={1} />
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Link href={Routes.ForgotPasswordPage()}>
            <StyleLink>Forgot your password?</StyleLink>
          </Link>
        </div>
      </Form>
      <Spacer y={1} />
      <div>
        <Link href={Routes.SignupPage()}>
          <StyleLink> Sign Up</StyleLink>
        </Link>
      </div>
    </Card>
  )
}

export default LoginForm

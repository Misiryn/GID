import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Text, Button } from "@nextui-org/react"

const ResetPasswordPage: BlitzPage = () => {
  return (
    <Card css={{ maxWidth: "500px", mx: "auto", my: "$16", p: "$10" }}>
      <Text h3>Password Reset</Text>
      <Text css={{ color: "$accents7", my: "$4" }}>
        Password reset tokens are managed via the authentication dashboard. Please sign in with your credentials.
      </Text>
      <Link href={Routes.LoginPage()}>
        <Button as="a" color="primary" auto>
          Back to Login
        </Button>
      </Link>
    </Card>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>

export default ResetPasswordPage

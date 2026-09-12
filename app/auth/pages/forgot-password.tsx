import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Card, Text, Button, Spacer } from "@nextui-org/react"

const ForgotPasswordPage: BlitzPage = () => {
  return (
    <Card css={{ maxWidth: "500px", mx: "auto", my: "$16", p: "$10" }}>
      <Text h3>Forgot your password?</Text>
      <Text css={{ color: "$accents7", my: "$4" }}>
        This instance is connected to Supabase PostgreSQL with preconfigured demo accounts:
      </Text>
      <div style={{ background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
        <Text b css={{ display: "block", fontSize: "$sm" }}>
          Admin: admin@example.com / AdminPassword123!
        </Text>
        <Text b css={{ display: "block", fontSize: "$sm", mt: "$2" }}>
          User: rahul@example.com / UserPassword123!
        </Text>
      </div>
      <Link href={Routes.LoginPage()}>
        <Button as="a" color="primary" auto>
          Back to Login
        </Button>
      </Link>
    </Card>
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = "/"
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>

export default ForgotPasswordPage

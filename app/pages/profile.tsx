import { BlitzPage, Link, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"

import { Button, Card, Container, Spacer, Text } from "@nextui-org/react"
import Form, { FORM_ERROR } from "app/core/components/Form"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import LabeledTextField from "app/core/components/LabeledTextField"
import { Suspense } from "react"
import updateUser from "app/users/mutations/updateUser"

const Profile: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const [updateUserMutation] = useMutation(updateUser)
  return (
    <Container>
      <Card
        css={{
          display: "flex",
          maxWidth: "500px",
          p: "2rem",
          mx: "auto",
          bg: "none",
        }}
      >
        <Text h3>Hi, {currentUser?.name || currentUser?.email}</Text>
        <Form
          submitText="Update Profile"
          // schema={Signup}
          initialValues={{ email: currentUser?.email, name: currentUser?.name }}
          onSubmit={async (values) => {
            try {
              if (currentUser?.id) {
                await updateUserMutation({
                  id: currentUser?.id,
                  name: values.name,
                })

                window.location.reload()
              }
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
          <LabeledTextField name="email" label="Email" placeholder="Email" disabled />
          <Spacer y={1} />
        </Form>
      </Card>
    </Container>
  )
}

Profile.suppressFirstRenderFlicker = true
Profile.authenticate = true
Profile.getLayout = (page) => (
  <Layout title="Home">
    <Suspense fallback={"...loading"}>{page}</Suspense>
  </Layout>
)

export default Profile

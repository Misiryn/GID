import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createService from "app/services/mutations/createService"
import { ServiceForm, FORM_ERROR } from "app/services/components/ServiceForm"
import { Card, Loading, Text } from "@nextui-org/react"
import { CreateService } from "app/services/validation"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Suspense } from "react"

const NewServicePage: BlitzPage = () => {
  const router = useRouter()
  const [createServiceMutation] = useMutation(createService)
  const currentUser = useCurrentUser()
  return (
    <Card
      css={{
        display: "flex",
        maxWidth: "500px",
        p: "2rem",
        mx: "auto",
        bg: "none",
      }}
    >
      <Text h3>Create New Service</Text>

      <ServiceForm
        submitText="Create Service"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        schema={CreateService}
        initialValues={{
          title: "",
          slug: "",
          details: "",
          price: 0,
          offerPrice: 0,
          coverImage: "",
          createdBy: currentUser?.id || -1,
        }}
        onSubmit={async (values) => {
          console.log(values)
          try {
            if (values.createdBy < 0) {
              throw new Error("Invalid User")
            }
            const service = await createServiceMutation({ ...values })
            router.push(Routes.ShowServicePage({ serviceId: service.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={"/services"}>
          <a>Services</a>
        </Link>
      </p>
    </Card>
  )
}

NewServicePage.authenticate = true
NewServicePage.getLayout = (page) => (
  <Layout title={"Create New Service"}>
    <Suspense fallback={<Loading />}>{page}</Suspense>
  </Layout>
)

export default NewServicePage

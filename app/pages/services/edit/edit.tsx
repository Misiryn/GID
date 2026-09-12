import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getServices from "app/services/queries/getServices"
import mutateService from "app/services/mutations/mutateService"
import { ServiceForm, FORM_ERROR } from "app/services/components/ServiceForm"
import { Card, Text } from "@nextui-org/react"

export const EditService = () => {
  const router = useRouter()
  const serviceId = useParam("serviceId", "number")
  const [service, { setQueryData }] = useQuery(
    getServices,
    { id: serviceId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [mutateServiceMutation] = useMutation(mutateService)

  return (
    <>
      <Head>
        <title>Edit Service | {service.title}</title>
      </Head>

      <Card
        css={{
          display: "flex",
          maxWidth: "500px",
          p: "2rem",
          mx: "auto",
          bg: "none",
        }}
      >
        <Text h3>Edit Service {service.title}</Text>
        <ServiceForm
          submitText="Update Service"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateService}
          initialValues={service}
          onSubmit={async (values) => {
            try {
              const updated: any = await mutateServiceMutation({
                action: "update",
                id: service.id,
                data: values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowServicePage({ serviceId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Card>
    </>
  )
}

const EditServicePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditService />
      </Suspense>

      <p>
        <Link href={"/services"}>
          <a>Services</a>
        </Link>
      </p>
    </div>
  )
}

EditServicePage.authenticate = true
EditServicePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditServicePage

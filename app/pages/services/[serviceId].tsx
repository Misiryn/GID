import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getService from "app/services/queries/getService"
import deleteService from "app/services/mutations/deleteService"

export const Service = () => {
  const router = useRouter()
  const serviceId = useParam("serviceId", "number")
  const [deleteServiceMutation] = useMutation(deleteService)
  const [service] = useQuery(getService, { id: serviceId })

  return (
    <>
      <Head>
        <title>Service {service.id}</title>
      </Head>

      <div>
        <h1>Service {service.id}</h1>
        <pre>{JSON.stringify(service, null, 2)}</pre>

        <Link href={Routes.EditServicePage({ serviceId: service.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteServiceMutation({ id: service.id })
              router.push(Routes.ServicesPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowServicePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ServicesPage()}>
          <a>Services</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Service />
      </Suspense>
    </div>
  )
}

ShowServicePage.authenticate = true
ShowServicePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowServicePage

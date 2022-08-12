import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getServices from "app/services/queries/getServices"

const ITEMS_PER_PAGE = 100

export const ServicesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ services, hasMore }] = usePaginatedQuery(getServices, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <Link href={Routes.ShowServicePage({ serviceId: service.id })}>
              <a>{service.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ServicesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Services</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewServicePage()}>
            <a>Create Service</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ServicesList />
        </Suspense>
      </div>
    </>
  )
}

ServicesPage.authenticate = true
ServicesPage.getLayout = (page) => <Layout>{page}</Layout>

export default ServicesPage

import { Suspense } from "react"
import { Head, usePaginatedQuery, useRouter, BlitzPage, useMutation, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Spacer, Divider, Button, Text, Container, Table } from "@nextui-org/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getServices from "app/services/queries/getServices"
import { Service } from "@prisma/client"
import deleteService from "app/services/mutations/deleteService"

const ITEMS_PER_PAGE = 100

export const AdminServices = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ services, hasMore }, { refetch }] = usePaginatedQuery(getServices, {
    orderBy: { createdAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const [deleteServiceMutation] = useMutation(deleteService)
  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <Table
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <Table.Header>
          <Table.Column>ID</Table.Column>
          <Table.Column>Title</Table.Column>
          <Table.Column>Price</Table.Column>
          <Table.Column>Offer price</Table.Column>
          <Table.Column>Created At</Table.Column>
          <Table.Column>Action</Table.Column>
        </Table.Header>
        <Table.Body>
          {services.map((service: Service) => (
            <Table.Row key={service.id}>
              <Table.Cell>
                <Link href={Routes.ShowServicePage({ serviceId: service.id })}>
                  <a>{service.id}</a>
                </Link>
              </Table.Cell>
              <Table.Cell>{service.title}</Table.Cell>
              <Table.Cell>{service.price}</Table.Cell>
              <Table.Cell>{service.offerPrice}</Table.Cell>
              <Table.Cell>{service.createdAt.toDateString()}</Table.Cell>
              <Table.Cell css={{ display: "flex", gap: "$8" }}>
                <Link href={Routes.EditServicePage({ serviceId: service.id })}>
                  <Button size="xs" onClick={async () => {}}>
                    Edit
                  </Button>
                </Link>
                <Button
                  color="error"
                  bordered
                  size="xs"
                  onClick={async () => {
                    const sure = confirm("Are you sure you want to delete this order?")
                    if (sure) {
                      await deleteServiceMutation({ id: service.id })
                    }
                  }}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Spacer y={2} />
      <Divider />
      <Spacer y={2} />
      <Button.Group>
        <Button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </Button>
      </Button.Group>
    </>
  )
}

const AdminServicesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Services</title>
      </Head>

      <Container>
        <Text h2 css={{ mt: "$12" }}>
          Services
        </Text>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminServices />
        </Suspense>
      </Container>
    </>
  )
}

AdminServicesPage.authenticate = true
AdminServicesPage.getLayout = (page) => <Layout>{page}</Layout>

export default AdminServicesPage

import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOrders from "app/orders/queries/getOrders"
import { Spacer, Divider, Button, Text, Card, Container, Table } from "@nextui-org/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 100

export const OrdersList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ orders, hasMore }] = usePaginatedQuery(getOrders, {
    orderBy: { createdAt: "desc" },
    where: {
      createdBy: {
        id: currentUser?.id,
      },
    },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

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
          <Table.Column>Service Name</Table.Column>
          <Table.Column>Address</Table.Column>
          <Table.Column>Total</Table.Column>
          <Table.Column>Is Completed</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.service.title}</Table.Cell>
              <Table.Cell>{order.address}</Table.Cell>
              <Table.Cell>{order.total}</Table.Cell>
              <Table.Cell>{order.isCompleted ? "Yes" : "No"}</Table.Cell>
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

const OrdersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>

      <Container>
        <Text h2 css={{ mt: "$12" }}>
          Orders
        </Text>
        <Suspense fallback={<div>Loading...</div>}>
          <OrdersList />
        </Suspense>
      </Container>
    </>
  )
}

OrdersPage.authenticate = true
OrdersPage.getLayout = (page) => <Layout>{page}</Layout>

export default OrdersPage

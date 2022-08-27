import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOrders from "app/orders/queries/getOrders"
import { Spacer, Divider, Button, Text, Card, Container, Table } from "@nextui-org/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import updateOrder from "app/orders/mutations/updateOrder"
import deleteOrder from "app/orders/mutations/deleteOrder"

const ITEMS_PER_PAGE = 100

export const AdminOrders = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ orders, hasMore }, { refetch }] = usePaginatedQuery(getOrders, {
    orderBy: { createdAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  // mutationt to update order
  const [updateOrderMutation] = useMutation(updateOrder)
  const [deleteOrderMutation] = useMutation(deleteOrder)
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
          <Table.Column>Action</Table.Column>
        </Table.Header>
        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.service.title}</Table.Cell>
              <Table.Cell>{order.address}</Table.Cell>
              <Table.Cell>{order.total}</Table.Cell>
              <Table.Cell>{order.isCompleted ? "Yes" : "No"}</Table.Cell>
              <Table.Cell css={{ display: "flex", gap: "$8" }}>
                {!order.isCompleted && (
                  <Button
                    size="xs"
                    onClick={async () => {
                      await updateOrderMutation({ ...order, isCompleted: true })
                      refetch()
                    }}
                  >
                    Mark Completed
                  </Button>
                )}

                <Button
                  color="error"
                  bordered
                  size="xs"
                  onClick={async () => {
                    const sure = confirm("Are you sure you want to delete this order?")
                    if (sure) {
                      await deleteOrderMutation({ id: order.id })
                      refetch()
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

const AdminOrdersPage: BlitzPage = () => {
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
          <AdminOrders />
        </Suspense>
      </Container>
    </>
  )
}

AdminOrdersPage.authenticate = true
AdminOrdersPage.getLayout = (page) => <Layout>{page}</Layout>

export default AdminOrdersPage

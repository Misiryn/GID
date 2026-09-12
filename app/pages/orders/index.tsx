import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getOrders from "app/orders/queries/getOrders"
import { Spacer, Divider, Button, Text, Card, Container, Table } from "@nextui-org/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 100

import { Badge, User } from "@nextui-org/react"

export const OrdersList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ orders, hasMore, count }] = usePaginatedQuery(getOrders, {
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

  const getStatusBadge = (status?: string, isCompleted?: boolean) => {
    if (isCompleted || status === "COMPLETED") {
      return <Badge color="success" variant="flat">COMPLETED</Badge>
    }
    if (status === "IN_PROGRESS") {
      return <Badge color="warning" variant="flat">IN PROGRESS</Badge>
    }
    if (status === "ASSIGNED") {
      return <Badge color="secondary" variant="flat">EXPERT ASSIGNED</Badge>
    }
    return <Badge color="primary" variant="flat">CONFIRMED</Badge>
  }

  if (orders.length === 0) {
    return (
      <Card css={{ p: "$12", textAlign: "center", my: "$10" }}>
        <Text h3>No Bookings Yet</Text>
        <Text css={{ color: "$accents7", mb: "$6" }}>
          You haven't scheduled any home services yet.
        </Text>
        <Link href="/services">
          <Button auto color="primary" css={{ alignSelf: "center" }}>
            Explore Services
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "1rem" }}>
        {orders.map((order) => (
          <Card key={order.id} css={{ p: "$6", border: "1px solid #333" }}>
            <Card.Header css={{ p: 0, pb: "$4", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #282828" }}>
              <div>
                <Text b css={{ fontSize: "$lg" }}>
                  {order.service.title}
                </Text>
                <Text css={{ color: "$accents6", fontSize: "$xs" }}>
                  Booking ID: #{order.id} • Placed on {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </div>
              <div>{getStatusBadge(order.status, order.isCompleted)}</div>
            </Card.Header>

            <Card.Body css={{ py: "$6", px: 0 }}>
              <Grid.Container gap={2} alignItems="center">
                {/* Thumbnail */}
                <Grid xs={12} sm={2.5}>
                  <img
                    src={order.service.coverImage}
                    alt={order.service.title}
                    style={{
                      width: "100%",
                      height: "110px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                    }}
                  />
                </Grid>

                {/* Details */}
                <Grid xs={12} sm={6.5}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>
                      <Text b css={{ fontSize: "$sm" }}>
                        🗓 Scheduled Slot:
                      </Text>{" "}
                      <Text as="span" css={{ color: "$primary", fontWeight: "$semibold", fontSize: "$sm" }}>
                        {order.timeSlot || "Morning Slot"}
                      </Text>
                    </div>

                    <div>
                      <Text b css={{ fontSize: "$sm" }}>
                        👤 Service Professional:
                      </Text>{" "}
                      <Text as="span" css={{ fontSize: "$sm", color: "$accents8" }}>
                        {order.partnerName || "Verified Expert"} {order.partnerRating ? `(★ ${order.partnerRating})` : ""}
                      </Text>
                    </div>

                    <div>
                      <Text b css={{ fontSize: "$sm" }}>
                        📍 Address:
                      </Text>{" "}
                      <Text as="span" css={{ fontSize: "$xs", color: "$accents7" }}>
                        {order.address}
                      </Text>
                    </div>

                    <div>
                      <Text b css={{ fontSize: "$sm" }}>
                        💳 Payment:
                      </Text>{" "}
                      <Text as="span" css={{ fontSize: "$xs", color: order.is_paid ? "$success" : "$warning" }}>
                        {order.paymentMethod === "ONLINE" || order.is_paid
                          ? "Paid Online"
                          : "Pay After Service (Cash / UPI)"}
                      </Text>
                    </div>
                  </div>
                </Grid>

                {/* Total & Action */}
                <Grid xs={12} sm={3} css={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                  <Text css={{ color: "$accents7", fontSize: "$xs" }}>Total Amount</Text>
                  <Text b css={{ fontSize: "$2xl", color: "$text", mb: "$3" }}>
                    ₹{order.total}
                  </Text>
                  <Link href={Routes.ShowServicePage({ serviceId: order.service.id })}>
                    <Button auto size="sm" bordered color="primary">
                      Book Again
                    </Button>
                  </Link>
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
        ))}
      </div>

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

import { Suspense, useState } from "react"
import ReactMarkdown from "react-markdown"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getService from "app/services/queries/getService"
import deleteService from "app/services/mutations/deleteService"
import { Button, Container, Divider, Loading, Modal, Spacer, Text, Grid, Card } from "@nextui-org/react"
import { PaymentModal } from "app/services/components/PaymentModal"
import createOrder from "app/orders/mutations/createOrder"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

export const Service = () => {
  const router = useRouter()
  const serviceId = useParam("serviceId", "number")
  const [deleteServiceMutation] = useMutation(deleteService)
  const [createOrderMutation] = useMutation(createOrder)
  const currentUser = useCurrentUser()
  const [service] = useQuery(getService, { id: serviceId })
  const [isOpen, setIsOpen] = useState(false)
  const discount =
    service.price > service.offerPrice
      ? Math.round(((service.price - service.offerPrice) / service.price) * 100)
      : 0

  const inclusionsList = service.inclusions ? service.inclusions.split("\n") : []
  const exclusionsList = service.exclusions ? service.exclusions.split("\n") : []

  return (
    <>
      <Head>
        <title>{service.title} | GetItDone</title>
      </Head>
      <PaymentModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        total={service.offerPrice}
        onSuccess={async ({ address, paymentId, serviceDateTime, timeSlot, paymentMethod }) => {
          currentUser?.id &&
            createOrderMutation(
              {
                service: service.id,
                address,
                createdBy: currentUser?.id,
                is_paid: paymentMethod === "ONLINE",
                isCompleted: false,
                serviceDateTime: new Date(serviceDateTime),
                timeSlot,
                status: "CONFIRMED",
                partnerName: "Verified Expert Partner",
                partnerRating: 4.9,
                paymentMethod,
                total: service.offerPrice,
              },
              {
                onSuccess() {
                  router.push("/orders")
                },
              }
            )
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" }}>
        <Grid.Container gap={3}>
          {/* Main Content (Left) */}
          <Grid xs={12} md={7}>
            <div style={{ width: "100%" }}>
              {/* Cover Image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "360px",
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                <img
                  src={service.coverImage}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                  }}
                />
              </div>

              <Text h2 css={{ mt: "$8", mb: "$2" }}>
                {service.title}
              </Text>

              {service.category && (
                <Text css={{ color: "$accents6", fontSize: "$sm", mb: "$4" }}>
                  Category: {service.category.icon} {service.category.name}
                </Text>
              )}

              <Text css={{ color: "$accents8", fontSize: "$md", lineHeight: "1.6rem", mb: "$6" }}>
                {service.details}
              </Text>

              <Divider />

              {/* Inclusions */}
              {inclusionsList.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <Text h3 css={{ fontSize: "1.3rem", mb: "$4" }}>
                    ✅ What&apos;s Included
                  </Text>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {inclusionsList.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ color: "#10b981", fontSize: "1.1rem" }}>✓</span>
                        <Text css={{ fontSize: "$sm" }}>{item}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exclusions */}
              {exclusionsList.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                  <Text h3 css={{ fontSize: "1.3rem", mb: "$4" }}>
                    🚫 What&apos;s Excluded
                  </Text>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {exclusionsList.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <span style={{ color: "#ef4444", fontSize: "1.1rem" }}>✕</span>
                        <Text css={{ color: "$accents7", fontSize: "$sm" }}>{item}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Spacer y={2} />
              <Divider />
              <Spacer y={2} />

              {/* How it works */}
              <Text h3 css={{ fontSize: "1.3rem", mb: "$4" }}>
                How It Works
              </Text>
              <Grid.Container gap={2}>
                <Grid xs={12} sm={4}>
                  <Card css={{ p: "$4", bg: "$accents1" }}>
                    <Text b css={{ fontSize: "$md" }}>1. Pick Slot</Text>
                    <Text css={{ color: "$accents7", fontSize: "$xs", mt: "$2" }}>
                      Choose your preferred date and convenient time window.
                    </Text>
                  </Card>
                </Grid>
                <Grid xs={12} sm={4}>
                  <Card css={{ p: "$4", bg: "$accents1" }}>
                    <Text b css={{ fontSize: "$md" }}>2. Expert Visits</Text>
                    <Text css={{ color: "$accents7", fontSize: "$xs", mt: "$2" }}>
                      Certified & verified technician arrives at your doorstep.
                    </Text>
                  </Card>
                </Grid>
                <Grid xs={12} sm={4}>
                  <Card css={{ p: "$4", bg: "$accents1" }}>
                    <Text b css={{ fontSize: "$md" }}>3. Satisfaction</Text>
                    <Text css={{ color: "$accents7", fontSize: "$xs", mt: "$2" }}>
                      Inspect the service and pay with complete peace of mind.
                    </Text>
                  </Card>
                </Grid>
              </Grid.Container>
            </div>
          </Grid>

          {/* Sticky Booking Card (Right) */}
          <Grid xs={12} md={5}>
            <div style={{ width: "100%", position: "sticky", top: "100px" }}>
              <Card css={{ p: "$8", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text css={{ color: "$warning", fontWeight: "$bold" }}>
                    ★ {service.rating?.toFixed(1) || "4.8"} ({service.reviewCount || 100}+ reviews)
                  </Text>
                  <Text css={{ color: "$accents7", fontSize: "$sm" }}>
                    ⏱ {service.duration || "60 mins"}
                  </Text>
                </div>

                <Spacer y={1} />

                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <Text h1 css={{ fontSize: "2.5rem", m: 0 }}>
                    ₹{service.offerPrice}
                  </Text>
                  {discount > 0 && (
                    <>
                      <Text del color="error" css={{ fontSize: "1.3rem" }}>
                        ₹{service.price}
                      </Text>
                      <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "0.9rem" }}>
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                <Text css={{ color: "$accents7", fontSize: "$xs", mt: "$1", mb: "$6" }}>
                  Transparent pricing inclusive of all taxes & standard consumables
                </Text>

                <Button
                  size="lg"
                  color="primary"
                  css={{ w: "100%", py: "$8", fontSize: "$md", fontWeight: "$bold" }}
                  onClick={() => {
                    if (currentUser?.id) {
                      setIsOpen(true)
                    } else {
                      router.push("/login")
                    }
                  }}
                >
                  ⚡ Select Slot & Book Now
                </Button>

                <Spacer y={1} />

                {/* Trust Highlights */}
                <div style={{ marginTop: "1rem", borderTop: "1px solid #333", paddingTop: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span>🛡️</span>
                    <Text css={{ fontSize: "$xs", color: "$accents8" }}>
                      Covered by Urban Company 30-Day Guarantee
                    </Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>💵</span>
                    <Text css={{ fontSize: "$xs", color: "$accents8" }}>
                      Pay online or cash after service completion
                    </Text>
                  </div>
                </div>

                {/* Admin controls */}
                {currentUser?.role === "ADMIN" && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem", borderTop: "1px solid #333", paddingTop: "1rem" }}>
                    <Link href={Routes.EditServicePage({ serviceId: service.id })}>
                      <Button as="a" size="sm" bordered>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      color="error"
                      onClick={async () => {
                        if (window.confirm("Delete this service?")) {
                          await deleteServiceMutation({ id: service.id })
                          router.push("/services")
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </Grid>
        </Grid.Container>
      </div>
    </>
  )
}

const ShowServicePage: BlitzPage = () => {
  return (
    <Container>
      <p>
        <Link href={"/services"}>
          <a>Services</a>
        </Link>
      </p>

      <Suspense fallback={<Loading>Fetching Latest Data</Loading>}>
        <Service />
      </Suspense>
    </Container>
  )
}

ShowServicePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowServicePage

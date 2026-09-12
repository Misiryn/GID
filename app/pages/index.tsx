import { BlitzPage, Link, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Button, Card, Container, Grid, Row, Spacer, Text, Badge } from "@nextui-org/react"
import getCategories from "app/categories/queries/getCategories"
import getServices from "app/services/queries/getServices"
import { Suspense } from "react"

const HomeContent = () => {
  const [categories] = useQuery(getCategories, undefined)
  const [{ services }] = useQuery(getServices, {
    take: 6,
    orderBy: { rating: "desc" },
  })

  return (
    <Container css={{ maxW: "1200px", py: "$10" }}>
      {/* Hero Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <Badge color="primary" variant="flat" size="lg">
          On-Demand Home Services
        </Badge>
        <Text h1 css={{ fontSize: "2.8rem", mt: "$4", mb: "$2" }}>
          Get It Done, Instantly.
        </Text>
        <Text css={{ color: "$accents8", fontSize: "1.2rem", maxW: "650px", margin: "0 auto" }}>
          From deep home cleaning and AC servicing to doorstep salon care — book certified experts in minutes.
        </Text>
      </div>

      {/* Category Grid (Urban Company Style) */}
      <Text h3 css={{ mb: "$6" }}>
        Explore by Category
      </Text>
      <Grid.Container gap={2} justify="flex-start">
        {categories.map((cat) => (
          <Grid xs={6} sm={4} md={2.4} key={cat.id}>
            <Link href={`/services?category=${cat.slug}`}>
              <Card isPressable isHoverable css={{ p: "$6", textAlign: "center", height: "100%" }}>
                <Card.Body css={{ py: "$4", alignItems: "center" }}>
                  <Text css={{ fontSize: "2.5rem", mb: "$2" }}>{cat.icon}</Text>
                  <Text b css={{ fontSize: "$md", lineHeight: "1.2rem" }}>
                    {cat.name}
                  </Text>
                  <Text css={{ color: "$accents6", fontSize: "$xs", mt: "$2" }}>
                    {cat._count?.services || 0} services
                  </Text>
                </Card.Body>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid.Container>

      <Spacer y={3} />

      {/* Trust & Guarantee Markers */}
      <Card css={{ bg: "$accents1", p: "$8", my: "$10", borderRadius: "$lg" }}>
        <Grid.Container gap={3} justify="space-around">
          <Grid xs={12} sm={3} css={{ textAlign: "center" }}>
            <Text css={{ fontSize: "2rem" }}>🛡️</Text>
            <Text b css={{ fontSize: "$md" }}>Verified Experts</Text>
            <Text css={{ color: "$accents7", fontSize: "$sm" }}>
              100% background checked & professionally trained
            </Text>
          </Grid>
          <Grid xs={12} sm={3} css={{ textAlign: "center" }}>
            <Text css={{ fontSize: "2rem" }}>🏷️</Text>
            <Text b css={{ fontSize: "$md" }}>Fixed Transparent Rates</Text>
            <Text css={{ color: "$accents7", fontSize: "$sm" }}>
              Zero hidden charges. Pay after work satisfaction
            </Text>
          </Grid>
          <Grid xs={12} sm={3} css={{ textAlign: "center" }}>
            <Text css={{ fontSize: "2rem" }}>⚡</Text>
            <Text b css={{ fontSize: "$md" }}>Doorstep in 60 Mins</Text>
            <Text css={{ color: "$accents7", fontSize: "$sm" }}>
              Pick your preferred date & time window
            </Text>
          </Grid>
          <Grid xs={12} sm={3} css={{ textAlign: "center" }}>
            <Text css={{ fontSize: "2rem" }}>🔄</Text>
            <Text b css={{ fontSize: "$md" }}>30-Day Guarantee</Text>
            <Text css={{ color: "$accents7", fontSize: "$sm" }}>
              Free re-work if you are not fully satisfied
            </Text>
          </Grid>
        </Grid.Container>
      </Card>

      <Spacer y={2} />

      {/* Trending / Bestseller Services */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <Text h3 css={{ m: 0 }}>
            Most Booked Services
          </Text>
          <Text css={{ color: "$accents7", fontSize: "$sm" }}>
            Top customer-rated household services in your city
          </Text>
        </div>
        <Link href="/services">
          <Button light color="primary" auto>
            View All Services →
          </Button>
        </Link>
      </div>

      <Grid.Container gap={2} justify="flex-start">
        {services.map((service) => (
          <Grid key={service.id} xs={12} sm={6} md={4}>
            <Link href={Routes.ShowServicePage({ serviceId: service.id })}>
              <Card isPressable isHoverable css={{ w: "100%", h: "100%" }}>
                <Card.Body css={{ p: 0, position: "relative" }}>
                  <img
                    src={service.coverImage}
                    alt={service.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                    }}
                  />
                  {service.badge && (
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <Badge color="success" variant="flat">
                        {service.badge}
                      </Badge>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer css={{ flexDirection: "column", alignItems: "flex-start", p: "$6" }}>
                  <Row justify="space-between" align="center">
                    <Text css={{ color: "$accents7", fontSize: "$xs" }}>
                      ⏱ {service.duration || "60 mins"}
                    </Text>
                    <Text css={{ color: "$warning", fontWeight: "$bold", fontSize: "$xs" }}>
                      ★ {service.rating?.toFixed(1) || "4.8"} ({service.reviewCount || 100})
                    </Text>
                  </Row>
                  <Text b css={{ fontSize: "$md", mt: "$2", mb: "$4" }}>
                    {service.title}
                  </Text>
                  <Row justify="space-between" align="center" css={{ w: "100%" }}>
                    <div>
                      <Text b css={{ fontSize: "$lg" }}>
                        ₹{service.offerPrice}
                      </Text>
                      {service.price > service.offerPrice && (
                        <Text del css={{ color: "$accents6", fontSize: "$sm", ml: "$2" }}>
                          ₹{service.price}
                        </Text>
                      )}
                    </div>
                    <Button size="sm" auto color="primary">
                      Book Slot
                    </Button>
                  </Row>
                </Card.Footer>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid.Container>
    </Container>
  )
}

const Home: BlitzPage = () => {
  return (
    <Suspense fallback={<Container css={{ textAlign: "center", py: "$20" }}><Text>Loading marketplace...</Text></Container>}>
      <HomeContent />
    </Suspense>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home

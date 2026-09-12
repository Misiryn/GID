import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getServices from "app/services/queries/getServices"
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Loading,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

import getCategories from "app/categories/queries/getCategories"
import Badge from "app/core/components/Badge"

const ITEMS_PER_PAGE = 12

export const ServicesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const selectedCategory = (router.query.category as string) || "all"
  const currentUser = useCurrentUser()
  const [categories] = useQuery(getCategories, undefined)

  const whereClause =
    selectedCategory && selectedCategory !== "all"
      ? { category: { slug: selectedCategory } }
      : {}

  const [{ services, hasMore, count }] = usePaginatedQuery(getServices, {
    where: whereClause,
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const handleCategorySelect = (slug: string) => {
    router.push({
      pathname: "/services",
      query: slug === "all" ? {} : { category: slug },
    })
  }

  const goToPreviousPage = () =>
    router.push({
      query: { ...router.query, page: page - 1 },
    })
  const goToNextPage = () =>
    router.push({
      query: { ...router.query, page: page + 1 },
    })

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <Text h2 css={{ m: 0 }}>
            All Services
          </Text>
          <Text css={{ color: "$accents7", fontSize: "$sm" }}>
            Showing {services.length} of {count} available services
          </Text>
        </div>
        {currentUser?.role === "ADMIN" && (
          <Link href={Routes.NewServicePage()}>
            <Button auto color="secondary">
              + Add New Service
            </Button>
          </Link>
        )}
      </div>

      {/* Category Pills Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "20px",
        }}
      >
        <Button
          size="sm"
          auto
          bordered={selectedCategory !== "all"}
          color={selectedCategory === "all" ? "primary" : "default"}
          onClick={() => handleCategorySelect("all")}
        >
          All Services
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            auto
            bordered={selectedCategory !== cat.slug}
            color={selectedCategory === cat.slug ? "primary" : "default"}
            onClick={() => handleCategorySelect(cat.slug)}
          >
            {cat.icon} {cat.name}
          </Button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <Grid.Container gap={2} justify="flex-start">
        {services.map((service) => {
          const discount =
            service.price > service.offerPrice
              ? Math.round(((service.price - service.offerPrice) / service.price) * 100)
              : 0

          return (
            <Grid key={service.id} xs={12} sm={6} md={4}>
              <Link href={Routes.ShowServicePage({ serviceId: service.id })}>
                <Card isPressable isHoverable css={{ w: "100%", h: "100%" }}>
                  <Card.Body css={{ p: 0, position: "relative" }}>
                    <img
                      src={service.coverImage}
                      alt={service.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                      }}
                    />
                    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: "6px" }}>
                      {service.badge && (
                        <Badge color="success" variant="flat">
                          {service.badge}
                        </Badge>
                      )}
                      {discount > 0 && (
                        <Badge color="error" variant="flat">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer css={{ flexDirection: "column", alignItems: "flex-start", p: "$6" }}>
                    <Row justify="space-between" align="center">
                      <Text css={{ color: "$accents7", fontSize: "$xs" }}>
                        ⏱ {service.duration || "60 mins"}
                      </Text>
                      <Text css={{ color: "$warning", fontWeight: "$bold", fontSize: "$xs" }}>
                        ★ {service.rating?.toFixed(1) || "4.8"} ({service.reviewCount || 120})
                      </Text>
                    </Row>
                    <Text b css={{ fontSize: "$md", mt: "$2", mb: "$1" }}>
                      {service.title}
                    </Text>
                    {service.category && (
                      <Text css={{ color: "$accents6", fontSize: "$xs", mb: "$3" }}>
                        {service.category.icon} {service.category.name}
                      </Text>
                    )}
                    <Row justify="space-between" align="center" css={{ w: "100%", mt: "$2" }}>
                      <div>
                        <Text b css={{ fontSize: "$lg" }}>
                          ₹{service.offerPrice}
                        </Text>
                        {discount > 0 && (
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
          )
        })}
      </Grid.Container>

      {services.length === 0 && (
        <Card css={{ p: "$10", textAlign: "center", my: "$10" }}>
          <Text h4>No services found in this category.</Text>
          <Button auto css={{ mt: "$4", alignSelf: "center" }} onClick={() => handleCategorySelect("all")}>
            View All Services
          </Button>
        </Card>
      )}

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

const ServicesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Services</title>
      </Head>

      <Container>
        <Text h2 css={{ mt: "$12" }}>
          Explore Our Services
        </Text>
        <Spacer y={2} />
        <Divider />
        <Spacer y={2} />
        <Suspense fallback={<Loading />}>
          <ServicesList />
        </Suspense>
        <Spacer y={2} />
        <Divider />
        <Spacer y={2} />
        <Spacer y={2} />
      </Container>
    </>
  )
}

ServicesPage.getLayout = (page) => <Layout>{page}</Layout>

export default ServicesPage

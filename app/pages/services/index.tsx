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

const ITEMS_PER_PAGE = 9

export const ServicesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()
  const [{ services, hasMore }] = usePaginatedQuery(getServices, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      {currentUser?.role === "ADMIN" && (
        <>
          <Link href={Routes.NewServicePage()}>
            <Button as="a">Create Service</Button>
          </Link>
          <Spacer y={2} />
        </>
      )}
      <Grid.Container gap={2} justify="flex-start">
        {services.map((service) => (
          <Grid key={service.id} xs={12} sm={4}>
            <Link href={Routes.ShowServicePage({ serviceId: service.id })}>
              <Card isPressable>
                <Card.Body css={{ p: 0 }}>
                  <Card.Image
                    src={service.coverImage}
                    objectFit="cover"
                    width="100%"
                    height={240}
                    alt={service.title}
                  />
                </Card.Body>
                <Card.Footer css={{ justifyItems: "flex-start" }}>
                  <Row wrap="wrap" justify="space-between" align="center">
                    <Text b>{service.title}</Text>
                    <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                      ₹ {service.price}
                    </Text>
                  </Row>
                </Card.Footer>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid.Container>
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

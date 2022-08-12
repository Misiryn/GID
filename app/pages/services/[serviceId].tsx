import { Suspense } from "react"
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
  Image,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getService from "app/services/queries/getService"
import deleteService from "app/services/mutations/deleteService"
import { Button, Container, Divider, Loading, Spacer, Text } from "@nextui-org/react"

export const Service = () => {
  const router = useRouter()
  const serviceId = useParam("serviceId", "number")
  const [deleteServiceMutation] = useMutation(deleteService)
  const [service] = useQuery(getService, { id: serviceId })

  return (
    <>
      <Head>
        <title>Service | {service.title}</title>
      </Head>

      <div>
        {/* <pre>{JSON.stringify(service, null, 2)}</pre> */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "400px",
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        >
          <Image src={service.coverImage} alt={service.title} layout="fill" objectFit="cover" />
        </div>
        <Text h2 css={{ mt: "$10" }}>
          {service.title}
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text h2 margin={0}>
            ₹ {service.offerPrice} &nbsp;{" "}
          </Text>
          <Text del margin={0} color="error" css={{ fontSize: "1.5rem" }}>
            ₹ {service.price}
          </Text>
        </div>
        <Button size="lg" css={{ mt: "$12" }}>
          Book Now
        </Button>
        <Spacer y={2} />
        <Divider />
        <Spacer y={2} />
        <ReactMarkdown>{service.details}</ReactMarkdown>
        <Spacer y={2} />
        <Divider />
        <Spacer y={2} />
        <div style={{ display: "flex" }}>
          <Link href={Routes.EditServicePage({ serviceId: service.id })}>
            <Button as="a" bordered>
              Edit
            </Button>
          </Link>
          <Button
            type="button"
            color="error"
            onClick={async () => {
              if (window.confirm("This will be deleted")) {
                await deleteServiceMutation({ id: service.id })
                router.push(Routes.ServicesPage())
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Delete
          </Button>
        </div>
        <Spacer y={4} />
      </div>
    </>
  )
}

const ShowServicePage: BlitzPage = () => {
  return (
    <Container>
      <p>
        <Link href={Routes.ServicesPage()}>
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

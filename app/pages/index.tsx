import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"

import { Button, Container, Text } from "@nextui-org/react"

const Home: BlitzPage = () => {
  return (
    <Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "32rem",
          margin: "2rem auto",
        }}
      >
        <div>
          <Text h4 css={{ opacity: 0.5 }}>
            Welcome to get it done
          </Text>
          <Text h1>One Stop Solution to all of your Problem</Text>
        </div>
        <Link href={"/services"}>
          <Button as="a" css={{ mt: "$16" }}>
            Explore Our Services
          </Button>
        </Link>
      </div>
    </Container>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home

import { BlitzPage, Link, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"

import { Button, Container, Text } from "@nextui-org/react"

const Home: BlitzPage = () => {
  return (
    <Container css={{ backgroundColor: "none" }}>
      <div
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1449247613801-ab06418e2861?auto=format&fit=crop&w=1771&q=80")`,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0.2,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "32rem",
          margin: "2rem auto",
          zIndex: 100,
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

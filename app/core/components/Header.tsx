import { Avatar, Button, Container, Dropdown, Grid, Loading, Text, User } from "@nextui-org/react"
import logout from "app/auth/mutations/logout"
import { Link, Router, Routes, useMutation } from "blitz"
import React, { Suspense, useState } from "react"
import { useCurrentUser } from "../hooks/useCurrentUser"

export const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  return currentUser ? (
    <Dropdown placement="bottom-right">
      <Dropdown.Trigger>
        <Avatar
          bordered
          size="lg"
          as="button"
          color="secondary"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </Dropdown.Trigger>
      <Dropdown.Menu color="secondary" aria-label="Avatar Actions">
        <Dropdown.Item key="profile" css={{ height: "$18" }}>
          <Text b color="inherit" css={{ d: "flex" }}>
            Signed in as
          </Text>
          <Text b color="inherit" css={{ d: "flex" }}>
            {currentUser.email}
          </Text>
        </Dropdown.Item>
        <Dropdown.Item key="my_profile" withDivider>
          My Profile
        </Dropdown.Item>
        <Dropdown.Item key="service_history">Service History</Dropdown.Item>
        {/* {currentUser.role === "ADMIN" ? (

            <Dropdown.Item key="users" withDivider >
              Manage Users
            </Dropdown.Item>
            <Dropdown.Item key="services" withDivider>
              Manage Services
            </Dropdown.Item>

        ) } */}
        <Dropdown.Item key="logout" color="error" withDivider>
          <span onClick={async () => await logoutMutation()}>Log Out</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <>
      <Link href={Routes.LoginPage()}>
        <Button as="a" bordered auto>
          Login
        </Button>
      </Link>
      <Link href={Routes.SignupPage()}>
        <Button as="a" auto>
          Sign In
        </Button>
      </Link>
    </>
  )
}

export const Header = () => {
  return (
    <Container>
      <Grid.Container justify="space-between" css={{ py: "$8" }}>
        <Grid>
          <Link href={Routes.Home()}>
            <Text as="a" h3 css={{ fontSize: "1.5rem" }}>
              GetItDone
            </Text>
          </Link>
        </Grid>
        <Grid css={{ display: "flex", gap: "$8" }}>
          <Suspense fallback={<Loading />}>
            <UserInfo />
          </Suspense>
        </Grid>
      </Grid.Container>
    </Container>
  )
}

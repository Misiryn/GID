import { Suspense } from "react"
import { Head, usePaginatedQuery, useRouter, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { Spacer, Divider, Button, Text, Container, Table } from "@nextui-org/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { User } from "@prisma/client"
import getUsers from "app/users/queries/getUsers"
import deleteUser from "app/users/mutations/deleteUser"

const ITEMS_PER_PAGE = 100

export const AdminUsersList = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  const [{ users, hasMore }, { refetch }] = usePaginatedQuery(getUsers, {
    orderBy: { createdAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const [deleteUserMutation] = useMutation(deleteUser)
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
          <Table.Column>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Role</Table.Column>
          <Table.Column>Created At</Table.Column>
          <Table.Column>Action</Table.Column>
        </Table.Header>
        <Table.Body>
          {users.map((user: User) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.id}</Table.Cell>
              <Table.Cell>{user.name || "---"}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>{user.createdAt.toDateString()}</Table.Cell>
              <Table.Cell css={{ display: "flex", gap: "$8" }}>
                <Button
                  color="error"
                  bordered
                  size="xs"
                  onClick={async () => {
                    const sure = confirm("Are you sure you want to delete this order?")
                    if (sure) {
                      await deleteUserMutation({ id: user.id })
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

const UsersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <Container>
        <Text h2 css={{ mt: "$12" }}>
          Users
        </Text>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminUsersList />
        </Suspense>
      </Container>
    </>
  )
}

UsersPage.authenticate = true
UsersPage.getLayout = (page) => <Layout>{page}</Layout>

export default UsersPage

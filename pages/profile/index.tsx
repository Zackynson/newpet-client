import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import { useAuth } from '@contexts/AuthContext'
import { Button, Center, Container, Spinner } from '@chakra-ui/react'

function UserPage() {
  const { user, loading, logout } = useAuth()

  return (
    <Container maxW={'container.xl'}>
      <Head>
        <title>NEWPET | {user?.name}</title>
        <meta
          name="description"
          content="O melhor app de adoção de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading ? (
        <div
          style={{
            alignSelf: 'center',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </div>
      ) : (
        <>
          <h1
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              marginBottom: '2rem',
            }}
          >
            {user?.name}
          </h1>
        </>
      )}

      <Center>
        <Button
          isLoading={loading}
          onClick={logout}
          maxW="xl"
          colorScheme="red"
        >
          Sair
        </Button>
      </Center>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['newpet-token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default UserPage

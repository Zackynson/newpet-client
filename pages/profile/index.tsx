import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import Header from '@components/Header'
import { useRouter } from 'next/router'
import { useAuth } from '@contexts/AuthContext'
import Card from '@components/Card'
import { Spinner } from '@chakra-ui/react'

function UserPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  return (
    <>
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
          <Card>
            <div style={{ flex: 1, width: '100%', height: '100%' }}>oi</div>
          </Card>
        </>
      )}
    </>
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

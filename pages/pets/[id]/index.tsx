import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Pet } from 'types/Pet'
import { useRouter } from 'next/router'
import PetDetail from '@components/PetDetail'
import { Spinner } from '@chakra-ui/react'
import { getSession, useSession } from 'next-auth/react'

function PetDetailPage() {
  const [pet, setPet] = useState<Pet>()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()

  const loadPet = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/pets/' + id, {
        headers: {
          authorization: session?.user.token as string,
        },
      })

      setPet(res.data)
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao buscar os pets')
    }

    setLoading(false)
  }, [id, session])

  useEffect(() => {
    loadPet()
  }, [])

  return (
    <>
      <Head>
        <title>NEWPET | PET</title>
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
        <PetDetail pet={pet as Pet} />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
export default PetDetailPage

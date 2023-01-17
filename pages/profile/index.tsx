import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import AvatarPlaceholder from '@public/assets/avatar.png'
import { useAuth } from '@contexts/AuthContext'
import {
  Avatar,
  Button,
  Card,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  VStack,
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { api } from '@services/api'
import { toast } from 'react-toastify'
import { Pet } from 'types/Pet'
import PetCard from '@components/PetCard'
import Link from 'next/link'

function UserPage() {
  const { user, loading, logout } = useAuth()
  const [loadingPets, setLoadingPets] = useState(false)
  const [userPets, setUserPets] = useState([])

  const loadPets = useCallback(async () => {
    setLoadingPets(true)
    try {
      const res = await axios.get('/api/pets', {
        headers: {
          authorization: api.defaults.headers.authorization as string,
        },
      })
      setUserPets(res.data.filter((p: Pet) => p?.ownerId === user?._id))
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao buscar seus pets')
    }

    setLoadingPets(false)
  }, [user])

  useEffect(() => {
    loadPets()
  }, [loadPets])

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

      {loading || loadingPets ? (
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
        <Center flexDirection={'column'}>
          <Card>
            <VStack>
              <Avatar
                src={user?.avatar || AvatarPlaceholder.src}
                loading="eager"
                objectFit="cover"
                size={'2xl'}
              />
              <Heading my={10} textAlign={'center'}>
                {user?.name}
              </Heading>
            </VStack>
          </Card>
        </Center>
      )}

      <Flex
        gap={10}
        align="center"
        direction={'column'}
        justify={'center'}
        wrap="wrap"
      >
        {userPets.length ? (
          <>
            <Heading mb={5}>Seus pets</Heading>

            {userPets?.map((pet: Pet) => (
              <Link key={`${pet._id}`} href={`/pets/${pet._id}`}>
                <PetCard key={`${pet._id}`} pet={pet} />
              </Link>
            ))}
          </>
        ) : (
          <VStack mt={10}>
            <Heading size={'md'} textAlign={'center'}>
              Você ainda não cadastrou nenhum pet
            </Heading>

            <Link href="/pets/register">
              <Button variant={'link'} colorScheme="blue">
                Cadastre agora
              </Button>
            </Link>
          </VStack>
        )}
      </Flex>

      <Center>
        <Button
          isLoading={loading}
          onClick={logout}
          maxW="xl"
          colorScheme="red"
          my={8}
          variant="link"
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

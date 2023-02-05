import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import AvatarPlaceholder from '@public/assets/avatar.png'
import { useAuth } from '@contexts/AuthContext'
import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Container,
  Flex,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  LinkBox,
  Spinner,
  StackDivider,
  useColorModeValue,
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
import { EditIcon } from '@chakra-ui/icons'
import { getSession, signOut, useSession } from 'next-auth/react'

function UserPage() {
  const [loadingPets, setLoadingPets] = useState(false)
  const [userPets, setUserPets] = useState([])

  const { data: session } = useSession()

  const loadPets = useCallback(async () => {
    setLoadingPets(true)
    try {
      const res = await axios.get('/api/pets', {
        headers: {
          authorization: session?.user.token as string,
        },
      })
      setUserPets(res.data.filter((p: Pet) => p?.ownerId === session?.user?.id))
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao buscar seus pets')
    }

    setLoadingPets(false)
  }, [session?.user])

  useEffect(() => {
    loadPets()
  }, [loadPets])

  return (
    <Container py={10} maxW={'container.xl'}>
      <Head>
        <title>NEWPET | {session?.user?.name}</title>
        <meta
          name="description"
          content="O melhor app de adoção de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card variant={'outline'} py={10}>
        {loadingPets ? (
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
            <VStack divider={<StackDivider />}>
              <Box my={10} w={'100%'}>
                <HStack justify={'space-around'}>
                  <Avatar
                    src={session?.user?.image || AvatarPlaceholder.src}
                    loading="eager"
                    objectFit="cover"
                    size={'2xl'}
                  />

                  <Box>
                    <FormLabel>
                      nome: <strong>{session?.user?.name}</strong>
                    </FormLabel>

                    <FormLabel>
                      Email: <strong>{session?.user?.email}</strong>
                    </FormLabel>

                    <FormLabel>
                      WhatsApp: <strong>{session?.user?.phone}</strong>
                    </FormLabel>

                    <LinkBox>
                      <Link href={'/profile/update'}>
                        <Button
                          rightIcon={<EditIcon />}
                          mt={2}
                          w={'xs'}
                          colorScheme={'purple'}
                        >
                          Editar
                        </Button>
                      </Link>
                    </LinkBox>
                  </Box>
                </HStack>
              </Box>
              <Box>
                <Heading mt={5}>Seus pets</Heading>

                {userPets.length ? (
                  <>
                    <Grid templateColumns={'repeat(3, 1fr)'} gap={5} mt={10}>
                      {userPets?.map((pet: Pet) => (
                        <Link key={`${pet._id}`} href={`/pets/${pet._id}`}>
                          <PetCard key={`${pet._id}`} pet={pet} />
                        </Link>
                      ))}
                    </Grid>
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
              </Box>
            </VStack>
          </Center>
        )}

        <Flex
          gap={10}
          align="center"
          direction={'column'}
          justify={'center'}
          wrap="wrap"
        ></Flex>
        <Center>
          <Button
            onClick={() => signOut()}
            maxW="xl"
            colorScheme="red"
            my={8}
            variant="link"
          >
            Sair
          </Button>
        </Center>
      </Card>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session?.user.token) {
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

export default UserPage

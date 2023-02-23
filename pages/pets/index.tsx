import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import PetCard from '@components/PetCard'
import { Pet } from 'types/Pet'
import {
  Box,
  Card,
  CardBody,
  Center,
  CheckboxGroup,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  StackDivider,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { getSession, signOut, useSession } from 'next-auth/react'
import { PetSize } from 'types/enums/pet-size.enum'

function Pets() {
  const [pets, setPets] = useState([])
  const [filters, setFilters] = useState<Record<string, string | undefined>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const { data } = useSession()

  const loadPets = useCallback(
    async (params?: any) => {
      setLoading(true)
      try {
        const res = await axios.get('/api/pets', {
          headers: {
            authorization: data?.user.token,
          },
          params: { ...params },
        })
        setPets(res.data)
      } catch (error: any) {
        console.error(error)

        if (error?.response?.status === 401) {
          toast.error('Sua sessão expirou, desconectando')
          await signOut()
        }
        toast.error('Ocorreu um erro ao buscar os pets')
      }

      setLoading(false)
    },
    [data],
  )

  useEffect(() => {
    setPets([])
    loadPets(filters)
  }, [filters, loadPets])

  return (
    <>
      <Head>
        <title>NEWPET</title>
        <meta
          name="description"
          content="O melhor app de adoção de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box maxW="100vw">
        <Grid gap={0} maxW="100vw" minH="85vh" templateColumns={'20% 1fr'}>
          <Box overflow="hidden" bg={useColorModeValue('gray.50', 'gray.900')}>
            <VStack p={5} gap={2} align={'start'} divider={<StackDivider />}>
              {/* type*/}
              <Box>
                <Text>Type</Text>
                <RadioGroup
                  name="type"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      type: e?.length ? e : undefined,
                    })
                  }}
                  defaultValue={undefined}
                >
                  <VStack ml={2} mt={2} align={'start'}>
                    <Radio value="">Any</Radio>
                    <Radio value="dog">Dog</Radio>
                    <Radio value="cat">Cat</Radio>
                  </VStack>
                </RadioGroup>
              </Box>

              {/* size*/}
              <Box>
                <Text>Size</Text>
                <RadioGroup
                  name="size"
                  defaultValue={undefined}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      size: e?.length ? e : undefined,
                    })
                  }}
                >
                  <VStack ml={2} mt={2} align={'start'}>
                    <Radio value={''}>Any</Radio>
                    <Radio value={PetSize.SMALL}>Small</Radio>
                    <Radio value={PetSize.MEDIUM}>Medium</Radio>
                    <Radio value={PetSize.BIG}>Big</Radio>
                  </VStack>
                </RadioGroup>
              </Box>

              {/* gender */}
              <Box>
                <Text>Gender</Text>
                <RadioGroup
                  defaultValue={undefined}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      gender: e?.length ? e : undefined,
                    })
                  }}
                >
                  <VStack ml={2} mt={2} align={'start'}>
                    <Radio value={''}>Any</Radio>
                    <Radio value={'male'}>Male</Radio>
                    <Radio value={'female'}>Female</Radio>
                  </VStack>
                </RadioGroup>
              </Box>
            </VStack>
          </Box>
          <Flex
            gap={'5'}
            justify="center"
            align={loading || !pets.length ? 'center' : 'start'}
            p="10"
            wrap={'wrap'}
          >
            {loading ? <Spinner speed="0.65s" size="lg" /> : <></>}
            {pets.length && !loading ? (
              pets?.map((p: Pet) => (
                <Link key={`${p._id}`} href={'pets/' + p._id}>
                  <PetCard pet={p} />
                </Link>
              ))
            ) : (
              <></>
            )}

            {!loading && !pets.length ? (
              <Center>
                <Heading textAlign={'center'} size="md">
                  Não encontramos nenhum pet 😿
                  <br></br>
                  Tente atualizar seus filtros.
                </Heading>
              </Center>
            ) : (
              <></>
            )}
          </Flex>
        </Grid>
      </Box>
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

export default Pets

import Head from 'next/head'

import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  FormControl,
  FormLabel,
  Card,
  HStack,
  Text,
  Flex,
  Box,
  useMediaQuery,
  VStack,
  Image,
  Heading,
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { GetServerSideProps } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
  const [show, setShow] = useState<boolean>()
  const [isMobile] = useMediaQuery('(max-width: 768px)')
  const [loading, setLoading] = useState<boolean>()

  const handleClick = () => {
    setShow(!show)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const { data, status } = useSession()

  const router = useRouter()
  console.log({ data, status })

  type Inputs = {
    email: string
    password: string
  }

  const authenticate = useCallback(
    async (data: Inputs) => {
      setLoading(true)
      const res = await signIn('credentials', {
        ...data,
        callbackUrl: '/',
        redirect: false,
      })

      if (res?.ok) {
        toast.success('Autenticado com sucesso')
        router.push('/')
      }

      if (res?.error) {
        if (res.status === 401) {
          toast.error('Email ou senha inválidos')
        }
      }

      setLoading(false)
    },
    [router],
  )

  return (
    <>
      <Head>
        <title>NEWPET | LOGIN 🐶</title>
        <meta
          name="description"
          content="O melhor app de adoção de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        w={'100%'}
        h={'100vh'}
        align="center"
        justify={'center'}
        alignItems="center"
      >
        <Card
          w={isMobile ? 'container.sm' : 'container.lg'}
          p={isMobile ? '10' : ''}
          m={10}
          minH={isMobile ? '' : 'xl'}
          maxH={isMobile ? '' : '2xl'}
          overflow={'hidden'}
        >
          <HStack w={'100%'} h="100%" flex={1}>
            <FormControl
              as="form"
              flex="1"
              h={'full'}
              w={'full'}
              onSubmit={handleSubmit(authenticate)}
            >
              <VStack>
                <Heading
                  fontFamily={'modak'}
                  letterSpacing="px"
                  fontSize={'3rem'}
                  fontWeight="thin"
                >
                  NEWPET
                </Heading>
                <Box w={'200px'} pt={10} pb={4}>
                  <FormControl>
                    <FormLabel fontSize={'smaller'} size={'sm'} htmlFor="email">
                      e-mail
                    </FormLabel>
                    <Input
                      size={'sm'}
                      variant="flushed"
                      {...register('email', { required: 'Campo obrigatório' })}
                      type="text"
                      name="email"
                    />
                  </FormControl>
                  <ErrorMessage
                    as={<p style={{ color: 'red', fontSize: '0.75rem' }}></p>}
                    errors={errors}
                    name="email"
                  />
                </Box>
                <Box w={'200px'} pb={4}>
                  <FormControl>
                    <FormLabel
                      fontSize={'smaller'}
                      size={'sm'}
                      htmlFor="password"
                    >
                      senha
                    </FormLabel>
                    <InputGroup size="sm">
                      <Input
                        {...register('password', {
                          required: 'Campo obrigatório',
                        })}
                        name="password"
                        pr="2.5rem"
                        type={show ? 'text' : 'password'}
                        variant={'flushed'}
                      />
                      <InputRightElement width="4rem">
                        <Button
                          h="1rem"
                          ml={'6'}
                          variant={'ghost'}
                          size="sm"
                          onClick={handleClick}
                        >
                          {show ? (
                            <Icon as={AiOutlineEyeInvisible} />
                          ) : (
                            <Icon as={AiOutlineEye} />
                          )}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <ErrorMessage
                    as={<p style={{ color: 'red', fontSize: '0.75rem' }}></p>}
                    errors={errors}
                    name="password"
                  />
                </Box>

                <Button
                  isLoading={loading}
                  variant={'solid'}
                  type="submit"
                  colorScheme={'blue'}
                  w={200}
                  h={6}
                  mt={'3'}
                >
                  Entrar
                </Button>
                <Text as="small" textAlign={'center'} opacity={0.8} pt={4}>
                  Ainda não tem uma conta?
                </Text>
                <Link href="/register" style={{ textAlign: 'center' }}>
                  Crie uma agora
                </Link>
              </VStack>
            </FormControl>

            <Box
              flex="1"
              minH={'100%'}
              objectFit="contain"
              w={'full'}
              display={{ base: 'none', lg: 'flex' }}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image
                src="assets/blue_dog.jpg"
                position="relative"
                alt="bulldog sitting with a blue background"
              />
              <Text color={'white'} position={'absolute'} top={'20'}>
                Chegou a hora de encontrar seu novo pet <br></br> com o melhor
                app de adoção de animais do Brasil
              </Text>
            </Box>
          </HStack>
        </Card>
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

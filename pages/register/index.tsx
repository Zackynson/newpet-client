import Head from 'next/head'
import { useCallback, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import InputMask from 'react-input-mask'

import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  Card,
  HStack,
  Heading,
  Image,
  Box,
  Flex,
  useMediaQuery,
  useColorMode,
  FormControl,
  FormLabel,
  VStack,
} from '@chakra-ui/react'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const handleClick = () => setShowPassword(!showPassword)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>()
  const router = useRouter()

  const createAndLogin: SubmitHandler<Inputs> = useCallback(
    async (data: Inputs) => {
      setLoading(true)

      try {
        // register user
        await axios.post('/api/register', data)

        // login
        const res = await signIn('credentials', {
          ...data,
          callbackUrl: '/',
          redirect: false,
        })

        if (res?.ok) {
          toast.success('Autenticado com sucesso')
          router.push('/petss')
        }
      } catch (error: any) {
        if (
          error.response.status === 403 &&
          error.response.data.message === 'User already registered'
        ) {
          console.error(error)
          return toast.error('Usuário ja cadastrado')
        }

        if (
          error.response.status === 400 &&
          error.response.data.message.length
        ) {
          console.error(error)
          return toast.error(error.response.data.message[0])
        }

        toast.error('Ocorreu um erro inesperado ao cadastrar este usuário')

        console.error(error)
      }
      setLoading(false)
    },
    [router],
  )

  return (
    <>
      <Head>
        <title>NEWPET | REGISTRO 🐱</title>
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
            <Box
              objectFit={'cover'}
              w="50%"
              h={'100%'}
              display={{ base: 'none', lg: 'block' }}
            >
              <Image
                objectFit={'cover'}
                alt="cat"
                src={'assets/blue_cat.jpg'}
              />
            </Box>
            <FormControl
              as="form"
              flex="1"
              h={'full'}
              w={'full'}
              onSubmit={handleSubmit(createAndLogin)}
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

                <Box w={'200px'} pb={4}>
                  <FormLabel fontSize={'smaller'} size={'sm'} htmlFor="name">
                    name
                  </FormLabel>
                  <Input
                    size="sm"
                    variant="flushed"
                    {...register('name', { required: 'Campo obrigatório' })}
                    type="text"
                    name="name"
                  />
                  <ErrorMessage
                    as={<p style={{ color: 'red', fontSize: '0.75rem' }}></p>}
                    errors={errors}
                    name="name"
                  />
                </Box>
                <Box w={'200px'} pb={4}>
                  <FormLabel htmlFor="email" placeholder="seu melhor e-mail">
                    e-mail
                  </FormLabel>
                  <Input
                    size={'sm'}
                    variant="flushed"
                    {...register('email', { required: 'Campo obrigatório' })}
                    type="text"
                    name="email"
                  />
                  <ErrorMessage
                    as={<p style={{ color: 'red', fontSize: '0.75rem' }}></p>}
                    errors={errors}
                    name="email"
                  />
                </Box>
                <Box w={'200px'} pb={4}>
                  <FormLabel htmlFor="phone" placeholder="(12) 12345-1234">
                    whatsapp
                  </FormLabel>

                  <Input
                    as={InputMask}
                    mask="(99) 99999-9999"
                    maskChar={null}
                    size={'sm'}
                    variant="flushed"
                    {...register('phone', {
                      required: 'Campo obrigatório',
                    })}
                    type="text"
                    name="phone"
                  />

                  <ErrorMessage
                    as={<p style={{ color: 'red', fontSize: '0.75rem' }}></p>}
                    errors={errors}
                    name="phone"
                  />
                </Box>
                <Box w={'200px'} pb={4}>
                  <FormLabel htmlFor="password">password</FormLabel>
                  <InputGroup size="sm">
                    <Input
                      {...register('password', {
                        required: 'Campo obrigatório',
                        minLength: {
                          value: 8,
                          message: 'Password must have at least 8 characters',
                        },
                      })}
                      name="password"
                      pr="2.5rem"
                      type={showPassword ? 'text' : 'password'}
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
                        {showPassword ? (
                          <Icon as={AiOutlineEyeInvisible} />
                        ) : (
                          <Icon as={AiOutlineEye} />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  <ErrorMessage
                    as={<p style={{ color: 'red', fontSize: '0.75rem' }}></p>}
                    errors={errors}
                    name="password"
                  />
                </Box>
                <Box w={'200px'} pb={4}>
                  <FormLabel htmlFor="confirmPassword">
                    password confirmation
                  </FormLabel>
                  <InputGroup size="sm">
                    <Input
                      {...register('confirmPassword', {
                        required: 'Campo obrigatório',
                        minLength: 8,
                        validate: (value) =>
                          value === getValues('password') ||
                          'Password and Confirmation must be the same',
                      })}
                      name="confirmPassword"
                      pr="2.5rem"
                      type={showPassword ? 'text' : 'password'}
                      variant={'flushed'}
                    />
                    <InputRightElement width="4rem">
                      <Button
                        h="1rem"
                        ml={6}
                        variant={'ghost'}
                        size="sm"
                        onClick={handleClick}
                      >
                        {showPassword ? (
                          <Icon as={AiOutlineEyeInvisible} />
                        ) : (
                          <Icon as={AiOutlineEye} />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <ErrorMessage
                    as={<p style={{ color: 'red', fontSize: '0.75rem' }}></p>}
                    errors={errors}
                    name="confirmPassword"
                  />
                </Box>
                <>
                  <Button
                    isLoading={loading}
                    variant={'solid'}
                    type="submit"
                    bg={'#78cae3'}
                    color={'white'}
                    colorScheme="cyan"
                    w={200}
                    h={6}
                    mt={'3'}
                  >
                    Register
                  </Button>
                  <small style={{ textAlign: 'center', marginTop: 10 }}>
                    Already have an account?
                  </small>
                  <Link
                    href="/login"
                    style={{ textAlign: 'center', marginTop: 10 }}
                  >
                    Log in
                  </Link>
                </>
              </VStack>
            </FormControl>
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

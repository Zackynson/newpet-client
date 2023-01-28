import Head from 'next/head'
import catBackground from '@public/assets/blue_cat.jpg'
import { useCallback, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '@contexts/AuthContext'
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
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode('dark')
  }, [setColorMode])

  const handleClick = () => setShowPassword(!showPassword)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>()
  const { login } = useAuth()

  const createAndLogin: SubmitHandler<Inputs> = useCallback(
    async (data: Inputs) => {
      setLoading(true)

      try {
        // register user
        await axios.post('/api/register', data)

        // login
        await login(data.email, data.password)
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
    [login],
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
              <Image objectFit={'cover'} alt="cat" src={catBackground.src} />
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
                    DDD + Telefone
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
                  <FormLabel htmlFor="password">senha</FormLabel>
                  <InputGroup size="sm">
                    <Input
                      {...register('password', {
                        required: 'Campo obrigatório',
                        minLength: {
                          value: 8,
                          message: 'A senha deve conter no minimo 8 letras',
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
                    confirmação de senha
                  </FormLabel>
                  <InputGroup size="sm">
                    <Input
                      {...register('confirmPassword', {
                        required: 'Campo obrigatório',
                        minLength: 8,
                        validate: (value) =>
                          value === getValues('password') ||
                          'Senha e confirmação de senha devem ser iguais',
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
                    Entrar
                  </Button>
                  <small style={{ textAlign: 'center', marginTop: 10 }}>
                    Já possui uma conta?
                  </small>
                  <Link href="/" style={{ textAlign: 'center', marginTop: 10 }}>
                    Faça login
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

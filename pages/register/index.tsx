import Head from 'next/head'
import styles from './styles.module.css'
import catBackground from '@public/assets/blue_cat.jpg'
import { useCallback, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '@contexts/AuthContext'
import DoubleCard from '@components/DoubleCard'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
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
  Center,
  Container,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const handleClick = () => setShowPassword(!showPassword)

  const {
    register,
    handleSubmit,
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
          <HStack>
            <Box h={'100%'} display={isMobile ? 'none' : 'block'}>
              <Image alt="cat" src={catBackground.src} />
            </Box>
            <form
              style={{ height: '100%', marginBottom: '2rem' }}
              className={styles.login}
              onSubmit={handleSubmit(createAndLogin)}
            >
              <Heading
                fontWeight={'thin'}
                color={'#78cae3'}
                fontFamily={'Modak'}
                fontSize={'3rem'}
                letterSpacing={1}
                textShadow="-1px -1px 0 #555, 1px -1px 0 #555, -1px 1px 0 #555, 1px 1px 0 #555;"
              >
                NEWPET
              </Heading>
              <div className={styles['label-container']}>
                <label
                  className={styles.label}
                  htmlFor="name"
                  placeholder="Seu nome"
                >
                  nome
                </label>
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
              </div>
              <div className={styles['label-container']}>
                <label
                  className={styles.label}
                  htmlFor="email"
                  placeholder="seu melhor e-mail"
                >
                  e-mail
                </label>
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
              </div>
              <div className={styles['label-container']}>
                <label className={styles.label} htmlFor="password">
                  senha
                </label>
                <InputGroup size="sm">
                  <Input
                    {...register('password', {
                      required: 'Campo obrigatório',
                    })}
                    name="password"
                    pr="4.5rem"
                    type={showPassword ? 'text' : 'password'}
                    variant={'flushed'}
                  />
                  <InputRightElement width="4rem">
                    <Button
                      h="1rem"
                      variant={'outline'}
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
              </div>
              <div className={styles['label-container']}>
                <label className={styles.label} htmlFor="confirmPassword">
                  confirmação de senha
                </label>
                <InputGroup size="sm">
                  <Input
                    {...register('confirmPassword', {
                      required: 'Campo obrigatório',
                    })}
                    name="confirmPassword"
                    pr="4.5rem"
                    type={showPassword ? 'text' : 'password'}
                    variant={'flushed'}
                  />
                  <InputRightElement width="4rem">
                    <Button
                      h="1rem"
                      variant={'outline'}
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
              </div>

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
                <div className={styles['label-container']}>
                  <small style={{ textAlign: 'center', marginTop: 10 }}>
                    Já possui uma conta?
                  </small>
                  <Link href="/" style={{ textAlign: 'center', marginTop: 10 }}>
                    Faça login
                  </Link>
                </div>
              </>
            </form>
          </HStack>
        </Card>
      </Flex>
    </>
  )
}

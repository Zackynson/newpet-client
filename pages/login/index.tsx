import Head from 'next/head'
import styles from './styles.module.css'
import pugBackground from '@public/assets/blue_dog.jpg'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '@contexts/AuthContext'
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
  Divider,
  Box,
  useMediaQuery,
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function Home() {
  const [show, setShow] = useState<boolean>()
  const [isMobile] = useMediaQuery('(max-width: 768px)')

  const handleClick = () => {
    setShow(!show)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const { login, loading } = useAuth()

  type Inputs = {
    email: string
    password: string
  }

  const authenticate = useCallback(
    async (data: Inputs) => {
      if (!data.email?.length) return toast.error('Email é obrigatório')
      if (!data.password?.length) return toast.error('Senha é obrigatória')

      await login(data.email, data.password)
    },
    [login],
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
        >
          <HStack>
            <form
              className={styles.login}
              onSubmit={handleSubmit(authenticate)}
            >
              <h1>NEWPET</h1>
              <div className={styles['label-container']}>
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
              </div>
              <div
                className={styles['label-container']}
                style={{ marginTop: 20 }}
              >
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
              </div>

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
              <small
                style={{ textAlign: 'center', opacity: 0.8, marginTop: 10 }}
              >
                Ainda não tem uma conta?
              </small>
              <Link
                href="/register"
                style={{ textAlign: 'center', marginTop: 10 }}
              >
                Crie uma agora
              </Link>
            </form>
            <Box
              display={isMobile ? 'none' : 'block'}
              className={styles.aside}
              style={{ backgroundImage: `url('${pugBackground.src}')` }}
            >
              <Text mt={'20'}>
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

import axios, { AxiosHeaders } from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Header from '@components/Header'
import PetCard from '@components/PetCard'
import { Pet } from 'types/Pet'
import styles from './styles.module.css'
import { Box, Center, Container, Flex, HStack, Spinner } from '@chakra-ui/react'
import { api } from '@services/api'
import Link from 'next/link'

function Pets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState<boolean>(false)

  const loadPets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/pets', {
        headers: {
          authorization: api.defaults.headers.authorization as string,
        },
      })
      setPets(res.data)
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao buscar os pets')
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadPets()
  }, [loadPets])

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

      <Container maxW="max">
        <Flex gap={'5'} justify="center" p="10" wrap={'wrap'}>
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
              <Spinner speed="0.65s" color="black" size="lg" />
            </div>
          ) : (
            <></>
          )}
          {pets.length ? (
            pets?.map((p: Pet) => (
              <Link key={`${p._id}`} href={'pets/' + p._id}>
                <PetCard pet={p} />
              </Link>
            ))
          ) : (
            <></>
          )}
        </Flex>
      </Container>
    </>
  )
}

export default Pets

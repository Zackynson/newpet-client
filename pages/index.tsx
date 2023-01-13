import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Header from '@components/Header'
import PetCard from '@components/PetCard'
import { Pet } from 'types/Pet'
import styles from './styles.module.css'
import { Spinner } from '@chakra-ui/react'

function Pets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState<boolean>(false)

  const loadPets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/pets')
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

      <div style={{ textAlign: 'center', width: '100vw', marginTop: '2rem' }}>
        <h2>Bichinhos próximos de você</h2>
      </div>

      <div className={styles['pets-container']}>
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
          pets?.map((p: Pet) => <PetCard key={`${p._id}1`} pet={p} />)
        ) : (
          <></>
        )}
      </div>
    </>
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

export default Pets

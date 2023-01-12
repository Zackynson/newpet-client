import axios from 'axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import { useCallback, useEffect,  useState } from 'react'
import { toast } from 'react-toastify'
import Header from '@components/Header'
import PetCard from '@components/PetCard'
import Spinner from '@components/Spinner'
import { Pet } from '../../types/Pet'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import PetDetail from '@components/PetDetail'

export default function App() {
  const [pet, setPet] = useState<Pet>()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query



  const loadPets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/pets/' + id)
      setPet(res.data)
    } catch (error) {
      console.error(error)
      toast.error('Ocorreu um erro ao buscar os pets')
    }

    setLoading(false)
  }, [id])


  useEffect(() => {
       loadPets()
  },[loadPets])

  return  <>
  <Head>
    <title>NEWPET</title>
    <meta name="description" content="O melhor app de adoção de animais do Brasil" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
  
  <Header/>
  <div style={{textAlign: 'center', width: '100vw', marginTop: 10}}>
    <h2>{pet?.name}</h2>
  </div>

  <div className={styles['pets-container']}>
   {loading && pet
    ? <div style={{alignSelf: 'center', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Spinner/>
      </div> 
    : <> <PetDetail pet={pet as Pet || {}}/></>
    }
  </div>
  </>

}

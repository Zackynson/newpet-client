import Head from 'next/head'
import styles from '../styles/Register.module.css'
import catBackground from '../public/assets/blue_cat.jpg'
import { useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<any>()

  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>()


  const login =  useCallback(async() => {
    setLoading(true)
    try {
      const axiosInstance = axios.create()
  
      const { data } = await axiosInstance.post('/api/login', {email, password})
  
      setUser(data.user)
      toast.success('Bem vindo ' + data.user.name)
      
    } catch (error:any) {
      if(error.response.status === 401) {
        toast.error('e-mail ou senha inválidos')
      }
      console.error(error)
    }
    setLoading(false)
  },[email, password])



  return (
    <>
      <Head>
        <title>NEWPET | HOME 🐶</title>
        <meta name="description" content="O melhor app de adoção de animais do Brasil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <div className={styles.card}>
        <div className={styles.aside} style={{backgroundImage: `url('${catBackground.src}')`}}>
            {/* <p>Doe ou adote um novo amiguinho com o newpet</p> */}
          </div>
          <div className={styles.login}>
            <h1>NEWPET</h1>
            <div className={styles['label-container']}>
              <label  className={styles.label} htmlFor="name" placeholder='Seu nome'>Nome</label>
              <input type="text" name='name' onChange={v => setName(v.currentTarget.value)} />
            </div>
            <div className={styles['label-container']}>
              <label  className={styles.label} htmlFor="email" placeholder='seu melhor e-mail'>e-mail</label>
              <input type="text" name='email' onChange={v => setEmail(v.currentTarget.value)} />
            </div>
            <div className={styles['label-container']}>
              <label className={styles.label} htmlFor="password" placeholder='super secreta'>senha</label>
             <input type="password" name='password' onChange={v => setPassword(v.currentTarget.value)}/>
            </div>
            <div className={styles['label-container']}>
              <label className={styles.label} htmlFor="confirmPassword" placeholder='super secreta'>confirmação de senha</label>
             <input type="password" name='confirmPassword' onChange={v => setConfirmPassword(v.currentTarget.value)}/>
            </div>
            <button type='button' onClick={login} className={styles['login-btn']}>Entrar</button>
            <div className={styles['label-container']}>
              <small style={{textAlign: 'center', marginTop: 10}}>Já possui uma conta?</small>
              <Link href='/' style={{textAlign: 'center', marginTop: 10}}>Faça login</Link>
            </div>
          </div>


          
        </div>
      </main>
    </>
  )
}

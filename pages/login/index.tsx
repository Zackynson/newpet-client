import Head from 'next/head'
import styles from './styles.module.css'
import pugBackground from '@public/assets/pug_yellow.jpg'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useAuth } from '@contexts/AuthContext'
import Spinner from '@components/Spinner'

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { login, loading } = useAuth()

  const disableButton = useMemo(() => !email || !password, [email, password])

  const authenticate = useCallback(async () => {
    if (!email?.length) return toast.error('Email é obrigatório')
    if (!password?.length) return toast.error('Senha é obrigatória')

    login(email, password)
  }, [email, password, login])

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

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.login}>
            <h1>NEWPET</h1>
            <div className={styles['label-container']}>
              <label
                className={styles.label}
                htmlFor="email"
                placeholder="seu melhor e-mail"
              >
                e-mail
              </label>
              <input
                type="text"
                name="email"
                onChange={(v) => setEmail(v.currentTarget.value)}
              />
            </div>
            <div className={styles['label-container']}>
              <label
                className={styles.label}
                htmlFor="password"
                placeholder="super secreta"
              >
                senha
              </label>
              <input
                type="password"
                name="password"
                onChange={(v) => setPassword(v.currentTarget.value)}
              />
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <>
                <button
                  disabled={loading || disableButton}
                  type="button"
                  onClick={authenticate}
                  className={styles['login-btn']}
                >
                  Entrar
                </button>
                <div className={styles['label-container']}>
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
                </div>
              </>
            )}
          </div>

          <div
            className={styles.aside}
            style={{ backgroundImage: `url('${pugBackground.src}')` }}
          >
            <p>
              Chegou a hora de encontrar seu novo pet <br></br> com o melhor app
              de adoção de animais do Brasil
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

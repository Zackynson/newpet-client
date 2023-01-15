import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import { makeLoginRequest, getUserInfoFromToken } from '@services/auth'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { useRouter } from 'next/router'
import { api } from '@services/api'

type User = {
  _id: string
  name: string
  email: string
  avatar: string
  updatedAt?: string
  createdAt?: string
}

type AuthContextData = {
  isAuthenticated: boolean
  loading: boolean
  logout: () => Promise<void>
  // eslint-disable-next-line no-unused-vars
  login: (email: string, password: string) => Promise<void>
  user: User | null
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: any }) {
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const isAuthenticated = useMemo(() => !!user?._id, [user])

  const logout = useCallback(async (): Promise<void> => {
    destroyCookie(undefined, 'newpet-token')
    setUser(null)
    router.reload()
  }, [router])

  const getInfoFromToken = useCallback(
    async (token: string) => {
      if (!token.length) return

      setLoading(true)

      try {
        const data = await getUserInfoFromToken(token)

        if (!data?.user) {
          return
        }

        setUser(data.user)
        setLoading(false)

        if (router.asPath === '/login' || router.asPath === '/register')
          await router.push('/')
      } catch (error) {
        logout()
      }
    },
    [router, logout],
  )

  useEffect(() => {
    if (!user?._id) {
      const cookies = parseCookies()
      const token = cookies['newpet-token']

      try {
        if (token?.length > 0 && token !== 'undefined') {
          getInfoFromToken(token)
        }
      } catch (error) {
        logout()
      }
    }
  }, [getInfoFromToken, user, router, logout])

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)

      try {
        const { user, token } = await makeLoginRequest(email, password)

        setUser(user)

        if (token?.length > 0 && token !== 'undefined') {
          setCookie(undefined, 'newpet-token', token, {
            maxAge: 60 * 60 * 24, // 24 hours
          })

          api.defaults.headers['authorization'] = 'Bearer ' + token
        }

        setLoading(false)
        if (router.asPath === '/login' || router.asPath === '/register')
          await router.push('/')
        else console.log(router.asPath)
      } catch (error: any) {
        if (error?.response?.status === 401) {
          toast.error('e-mail ou senha inválidos')
        }
        console.error(error)
      }

      setLoading(false)
    },
    [router],
  )

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

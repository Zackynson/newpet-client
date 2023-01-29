import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '../contexts/AuthContext'
import Layout from '@components/Layout'
import * as gtag from '@libs/analytics/gtag'

import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from '@chakra-ui/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const theme = extendTheme(
  {
    colors: {
      ...chakraTheme.colors,
      brand: chakraTheme.colors.blue,
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        h2: {
          overflow: 'hidden !important',
        },
      }),
    },
  },
  chakraTheme,
)

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <ChakraProvider resetCSS theme={theme} cssVarsRoot="body">
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  )
}

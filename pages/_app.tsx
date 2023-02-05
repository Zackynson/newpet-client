import * as gtag from '@libs/analytics/gtag'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Layout from '@components/Layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from '@chakra-ui/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'
import { SessionProvider } from 'next-auth/react'

const theme = extendTheme(
  {
    useSystemColorMode: false,
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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
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
    <SessionProvider session={session}>
      <ChakraProvider resetCSS theme={theme} cssVarsRoot="body">
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </ChakraProvider>
    </SessionProvider>
  )
}

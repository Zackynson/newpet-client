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
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
    const handleStart = (url: string) => {
      console.log(`Loading: ${url}`)
      NProgress.configure({
        showSpinner:false,
      })
      NProgress.start()
    }

    const handleStop = (url: any) => {
      gtag.pageview(url)
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])
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

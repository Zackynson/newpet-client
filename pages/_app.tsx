import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '../contexts/AuthContext'
import Layout from '@components/Layout'

import {
  Center,
  ChakraProvider,
  extendTheme,
  Spinner,
  theme as chakraTheme,
} from '@chakra-ui/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

const theme = extendTheme(
  {
    colors: {
      ...chakraTheme.colors,
      brand: chakraTheme.colors.blue,
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          bg: '#f9f9f9',
        },
      }),
    },
  },
  chakraTheme,
)

export default function App({ Component, pageProps }: AppProps) {
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

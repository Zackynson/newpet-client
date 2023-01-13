import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '../contexts/AuthContext'
import Layout from '@components/Layout'
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS cssVarsRoot="body">
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  )
}

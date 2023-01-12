import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function App({ Component, pageProps }: AppProps) {
  const {isAuthenticated} = useAuth()

  return <AuthProvider>
    {isAuthenticated ? <Header/>: <></>}
    <Component {...pageProps} />  
    <ToastContainer />
  </AuthProvider>
}

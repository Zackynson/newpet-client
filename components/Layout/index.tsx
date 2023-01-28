// components/Layout.js
import AuthorizedHeader from '@components/Header/AuthorizedHeader'
import NonAuthorizedHeader from '@components/Header/NonAuthorizedHeader'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'

import React from 'react'

// import { Container } from './styles';

const NOT_ALLOWED_HEADER_ROUTES = ['/login', '/register']

const Layout = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[]
}) => {
  const { asPath } = useRouter()

  return NOT_ALLOWED_HEADER_ROUTES.includes(asPath) ? (
    <>
      <NonAuthorizedHeader />
      {children}
    </>
  ) : (
    <>
      <AuthorizedHeader />
      {children}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['newpet-token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Layout

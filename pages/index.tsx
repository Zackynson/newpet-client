import Head from 'next/head'
import { useCallback, useState } from 'react'
import axios from 'axios'

import {
  Box,
} from '@chakra-ui/react'
import { getSession } from 'next-auth/react'
import { GetServerSideProps,  } from 'next'

export default function Register() {
 return <Box></Box>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/pets',
        permanent: false,
      },
    }
  }


 return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
}

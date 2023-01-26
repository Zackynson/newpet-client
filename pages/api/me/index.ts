// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'

type Data = {
  user?: any, 
  token?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { token } = req.body || {}

  const userResponse = await api.get('auth/me', {
    headers: {
      Authorization: 'Bearer ' + token
    },
  })

  res.status(200).json({ user: userResponse.data })
   
}
export const config = {
  api: {
    caches: []
  },
}

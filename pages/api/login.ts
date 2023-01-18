// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'
import axiosRetry from 'axios-retry';

type Data = {
  user?: any, 
  token?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {email, password} = req.body

  axiosRetry(api, { retries: 3 });

  try {
    const loginResponse = await api.post('/auth/login', {
      email, password
    })

    const token = loginResponse.data.token

    api.defaults.headers['authorization'] = 'Bearer ' + token;

    const userResponse = await api.get('/auth/me', {
      headers: {
        Authorization: 'Bearer ' + token
      },
    })

    res.status(200).json({ user: userResponse.data, token: token })
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message:error.response.data.message })
  }
   
}

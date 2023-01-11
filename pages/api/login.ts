// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

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

  try {
    const loginResponse = await axios.post('https://ssn4zldt26.execute-api.us-east-1.amazonaws.com/dev/auth/login', {
      email, password
    })

    const token = loginResponse.data.token

    const userResponse = await axios.get('https://ssn4zldt26.execute-api.us-east-1.amazonaws.com/dev/auth/me', {
      headers: {
        Authorization: 'Bearer ' + token
      },
    })

    res.status(200).json({ user: userResponse.data, token: token })
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message: 'Email ou senha invalidos' })
  }
   
}

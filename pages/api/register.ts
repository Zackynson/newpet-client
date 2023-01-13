// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {name, email, password, confirmPassword} = req.body

  try {
    const loginResponse = await api.post('/users', {
      name, email, password, confirmPassword
    })

    res.status(200).json(loginResponse.data)
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message:error.response.data.message })
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  try {
    const petsResponse = await api.post('pets', req.body, {
      headers: {
        authorization: req.headers.authorization
      }
    })

    res.status(200).json(petsResponse.data.data)
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message:error.response.data.message })
  }
   
}

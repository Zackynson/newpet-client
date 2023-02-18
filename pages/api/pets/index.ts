// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {

    console.log(req.query)
    const petsResponse = await api.get('pets', {
      headers: {
        authorization: req.headers.authorization
      },
      params:req.query
      
    })

    res.status(200).json(petsResponse.data.data)
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message:error.response.data.message })
  }
   
}

export const config = {
  api: {
    responseLimit: '8mb',
  },
}

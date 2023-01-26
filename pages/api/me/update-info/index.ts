// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'
import axios from 'axios'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {


  try {
    await api.put(`users`, {...req.body}, {
      headers: {
        authorization: req.headers.authorization
      }
    })

    return res.status(200).json({ message: 'Dados atualizados com sucesso'})
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message:error.response.data.message })
  }
   
}


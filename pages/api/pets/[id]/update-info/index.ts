// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {


  const {id} = req.query;

  try {
    await api.put(`pets/${id}`, req.body, {
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


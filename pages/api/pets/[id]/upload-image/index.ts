// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '@services/api'
import axiosRetry from 'axios-retry';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {


  const {id} = req.query;
  const {image} = req.body

  if(!image)  return res.status(400).json({ message:'Imagem inválida' })

  try {

    await api.post(`pets/${id}/image` , {file: image.data_url}, {
      headers: {
        authorization: req.headers.authorization
      }
    })

    return res.status(200).json({ message: 'Imagem enviada com sucesso'})
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message:error.response.data.message })
  }
   
}

export const config = {
  api: {
    responseLimit: '8mb',
    bodyParser:{
      sizeLimit:'10mb',

    }
  },
}

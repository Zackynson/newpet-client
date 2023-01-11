// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosError } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {name, email, password, confirmPassword} = req.body

  try {
    const loginResponse = await axios.post('https://ssn4zldt26.execute-api.us-east-1.amazonaws.com/dev/users', {
      name, email, password, confirmPassword
    })

    res.status(200).json(loginResponse.data)
  } catch (error: any) {

    console.log(error.response)
    return res.status(error.response.status).json({ message:error.response.data.message })
  }
   
}

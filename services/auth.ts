import axios from "axios"

export const makeLoginRequest =  async( email:string, password:string ) => {
    const { data } = await axios.post('/api/login', {email, password})

    return data;
}

export const getUserInfoFromToken =  async(token: string ) => {
  const { data } = await axios.post('/api/me', { token })

  return data;
}
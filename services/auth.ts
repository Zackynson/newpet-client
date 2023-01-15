import axios from "axios"
import { api } from "./api";

export const makeLoginRequest =  async( email:string, password:string ) => {
    const { data } = await axios.post('/api/login', {email, password})
    api.defaults.headers['authorization'] = 'Bearer ' + data.token

    return data;
}

export const getUserInfoFromToken =  async(token: string ) => {
  const { data } = await axios.post('/api/me', { token })

  return data;
}
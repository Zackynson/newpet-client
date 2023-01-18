import axios from "axios";
import axiosRetry from "axios-retry";
import { parseCookies } from "nookies"; 

const {'newpet-token': token} = parseCookies()

export const api = axios.create({
  baseURL: 'https://ssn4zldt26.execute-api.us-east-1.amazonaws.com/dev'
})


export const apiWithRetry = axiosRetry(api, {retries: 3})

if(token?.length){
api.defaults.headers['authorization'] = 'Bearer ' + token}
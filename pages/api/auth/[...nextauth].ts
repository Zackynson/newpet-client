import { api } from "@services/api"
import axiosRetry from "axios-retry";
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
export const authOptions: NextAuthOptions= {
  session:{
    strategy: 'jwt'
  },
  callbacks:{
    jwt: async ({ token, user }) => {
      user && (token.user = user)
      return token
  },
  session: async ({ session, token }) => {
      if(token.user)session.user = token.user
      return session
  },
  },
  secret: process.env.TOKEN_SECRET,

  // Configure one or more authentication providers
  providers: [
    Credentials({
    name: "CredentialsProvider", 
    
    credentials:{},
    
    async authorize(creds:any) {

    axiosRetry(api, { retries: 3 });

    console.log({creds})

    let token = ''

    if(!creds?.token){
      const loginResponse = await api.post('/auth/login', creds)
      token =  'Bearer ' + loginResponse.data.token
    } else {
      token = creds.token
      console.log({token})
    }

    const userResponse = await api.get('/auth/me', {
      headers:{
        authorization: token
      }
    })

    return { 
        id: userResponse.data._id,
        name: userResponse.data.name, 
        image: userResponse.data.avatar,
        email: userResponse.data.email, 
        phone: userResponse.data.phone, 
        token, 
      }
  }})
  ],
}
export default NextAuth(authOptions)
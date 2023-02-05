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
  // Configure one or more authentication providers
  providers: [
    Credentials({
    name: "CredentialsProvider", 
    
    credentials:{},
    async authorize(creds) {

    axiosRetry(api, { retries: 3 });

    console.log({creds})
 
    const loginResponse = await api.post('/auth/login', creds)

    const token = loginResponse.data.token

    const userResponse = await api.get('/auth/me', {
      headers:{
        authorization: 'Bearer ' + token
      }
    })

    return { 
        id: userResponse.data._id,
        name: userResponse.data.name, 
        image: userResponse.data.avatar,
        email: userResponse.data.email, 
        phone: userResponse.data.phone, 
        token: 'Bearer ' + token, 
        
      }
  }})

  // ...add more providers here
    
  ],
}
export default NextAuth(authOptions)
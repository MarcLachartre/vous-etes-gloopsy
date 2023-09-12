import type { NextAuthOptions } from 'next-auth' 
import GoogleProvider from "next-auth/providers/google";
import StravaProvider from "next-auth/providers/strava";
import Auth0Provider from "next-auth/providers/auth0";

export const options: NextAuthOptions = {
    providers: [ 
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            }
          }),
          StravaProvider({
            clientId: process.env.STRAVA_CLIENT_ID as string,
            clientSecret: process.env.STRAVA_CLIENT_SECRET as string,
          }),
  Auth0Provider({
    clientId: process.env.AUTH0_CLIENT_ID as string,
    clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
    issuer: process.env.AUTH0_ISSUER
  })
    ],         
}

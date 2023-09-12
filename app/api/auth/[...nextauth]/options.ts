import type { NextAuthOptions } from 'next-auth' 
import GoogleProvider from "next-auth/providers/google";
import StravaProvider from "next-auth/providers/strava";

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
          })
    ],         
}

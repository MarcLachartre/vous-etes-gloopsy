import type { NextAuthOptions } from 'next-auth' 
// import StravaProvider from "next-auth/providers/strava";
import Auth0Provider from "next-auth/providers/auth0";

export const options: NextAuthOptions = {
    providers: [ 
        // StravaProvider({
        //     clientId: process.env.STRAVA_CLIENT_ID as string,
        //     clientSecret: process.env.STRAVA_CLIENT_SECRET as string,
        // }),

        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.nickname,
                    username: profile.username,
                    email: profile.email,
                    image: profile.picture,
                  }
            },
            
        })
    ],
    callbacks: {
        async session({ session, token }: any) {
            token.username !== undefined ? session.user.username = token.username : false
            
            return session
        },

        async jwt({token, profile}: any) {
            if (profile !== undefined) {
                token.username === undefined ? token.username = profile.username : false 
            }
            return token
        } 
    }
    
    
}        


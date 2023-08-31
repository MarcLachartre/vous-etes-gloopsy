import type { NextAuthOptions } from 'next-auth' 
import FacebookProvider from "next-auth/providers/facebook";

export const options: NextAuthOptions = {
    providers: [ 
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }),
    ],         
}

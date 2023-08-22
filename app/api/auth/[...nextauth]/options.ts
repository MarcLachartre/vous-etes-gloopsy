import type { NextAuthOptions } from 'next-auth' 
import GitHubProvider from 'next-auth/providers/github'
import FacebookProvider from "next-auth/providers/facebook";

export const options: NextAuthOptions = {
    providers: [ 
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }),
    ],          
    // callbacks: {
    //     async redirect({ url, baseUrl }) {
    //       // Allows relative callback URLs
    //       if (url.startsWith("/")) return `${baseUrl}${url}`
    //       // Allows callback URLs on the same origin
    //       else if (new URL(url).origin === baseUrl) return url
    //       return baseUrl
    //     }
    // } 
}

import type { NextAuthOptions } from 'next-auth' 
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from "next-auth/providers/facebook";

export const options: NextAuthOptions = {
    providers: [ 
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
        }),
        // CredentialsProvider({
        //     name: "Credentials",
        //     credentials: {
        //         username: { label: "Username", type: "text", placeholder: "Adrien Maussion" },
        //         password: { label: "Password", type: "password" }
        //     },
        //     async authorize(credentials, req) {
        //         // Add logic here to look up the user from the credentials supplied
        //         const user = { id: "1", name: "Adrien", email: "adrienmaussion@gmail.com", password: "nextauth" }
          
        //         if (credentials?.username === user.name && credentials?.password === user.password) {
        //           // Any object returned will be saved in `user` property of the JWT
        //           return user
        //         } else {
        //           // If you return null then an error will be displayed advising the user to check their details.
        //           return null
          
        //           // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        //         }
        //       }
        // })
    ]
}

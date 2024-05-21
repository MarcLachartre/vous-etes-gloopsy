import { getDatabase } from '@/lib/mongo-connection'
import type { NextAuthOptions, Session } from 'next-auth'
// import StravaProvider from "next-auth/providers/strava";
import Auth0Provider from 'next-auth/providers/auth0'

export const options: NextAuthOptions = {
    providers: [
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
        }),
    ],
    callbacks: {
        async session({ session, token }: any) {
            const db = await getDatabase()
            const user = await db
                .collection('users')
                .find({ email: session?.user?.email })
                .toArray()

            user[0] && token.username ? (session.user.user = user) : false

            token.username !== undefined
                ? (session.user.username = token.username)
                : false

            return session
        },

        async jwt({ token, profile }: any) {
            if (profile !== undefined) {
                token.username === undefined
                    ? (token.username = profile.username)
                    : false
            }
            return token
        },
    },
}

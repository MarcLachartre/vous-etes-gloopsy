import Auth0Provider from 'next-auth/providers/auth0'
import type { NextAuthConfig } from 'next-auth'

export default {
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER,
            async profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.nickname,
                    username: profile.username,
                    email: profile.email,
                    image: profile.picture,
                    role: profile.role,
                }
            },
        }),
    ],
    // debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig

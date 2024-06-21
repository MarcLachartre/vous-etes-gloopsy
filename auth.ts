import options from '@/auth.config.ts'
import { getDatabase } from './lib/mongo-connection.ts'
import NextAuth, { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            role: string
            username: string
            /**
             * By default, TypeScript merges new interface properties and overwrites existing ones.
             * In this case, the default session user properties will be overwritten,
             * with the new ones defined above. To keep the default session user properties,
             * you need to add them back into the newly declared interface.
             */
        } & DefaultSession['user']
    }
}

export const {
    auth,
    handlers: { GET, POST },
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
        async session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (session.user) {
                if (token.username) session.user.user = token.username
                if (token.role) session.user.role = token.role
            }

            return session
        },

        async jwt({ token, profile }) {
            if (!token.sub) return token

            const db = await getDatabase()
            const user = (
                await db
                    .collection('users')
                    .find({ email: token.email })
                    .toArray()
            )[0]
            if (!user) return token

            user
                ? (token.username = user.username)
                : (token.username = profile?.username)

            if (user && user.role) {
                token.role = user.role
            } else {
                token.role = 'GUEST'
            }

            return token
        },
    },
    ...options,
})

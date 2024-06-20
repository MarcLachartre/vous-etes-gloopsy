import NextAuth from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import authConfig from './auth.config'
import { apiAuthprefix, publicRoutes } from '@/routes'

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    // console.log('middleware triggered')
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthprefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    // console.log('ROUTE: ', req.nextUrl.pathname)
    // console.log('isPublicRoute: ', isPublicRoute)
    // console.log('isLoggedIn :', isLoggedIn)

    if (isApiAuthRoute) {
        return
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/api/auth/signin', nextUrl))
    }

    return
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}

'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'

import style from '../../css/auth-link.module.scss'

const AuthLink = () => {
    const [authLink, setAuthLink] = useState(<div></div>)

    useEffect(() => {
        const isAuthenticated = async () => {
            const session = await getSession()
            if (session === null) {
                setAuthLink(
                    <Link className={style.authLink} href="/api/auth/signin">
                        <h6>Sign in</h6>
                    </Link>
                )
            } else {
                setAuthLink(
                    <Link className={style.authLink} href="/api/auth/signout">
                        <h6>Sign out</h6>
                    </Link>
                )
            }
        }
        isAuthenticated()
    }, [])

    return <div className={style.authLinkContainer}>{authLink}</div>
}

export default AuthLink

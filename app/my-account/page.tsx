import { getServerSession } from 'next-auth/next'
import { options } from '../api/auth/[...nextauth]/options'

import { UserDetails } from '@/components/my-account/user-details'
import { Gloopstatistics } from '@/components/my-account/gloopstatistic'
import { Session } from 'next-auth'
import { getDatabase } from '@/lib/mongo-connection'
import { usernameValidation } from '@/lib/username-validation'
import { GeoJson } from '@/custom-types'

const getUserName = async () => {
    'use server'
    const db = await getDatabase()

    const session: (Session & { user: { username: string } }) | null =
        await getServerSession(options)

    const mongoUser = await db
        .collection('users')
        .findOne({ email: session?.user.email })

    if (mongoUser.username !== undefined) {
        return mongoUser.username
    } else if (session?.user.username !== null && session !== null) {
        return session.user.username
    } else if (session?.user.name !== null) {
        return session?.user.name
    } else {
        return ''
    }
}

const updateUsername = async (username?: string) => {
    'use server'

    if (username !== undefined && !usernameValidation(username).isValid) {
        return { ok: false, status: 400 }
    }

    const session: (Session & { user: { username: string } }) | null =
        await getServerSession(options)

    const db = await getDatabase()

    const res = await db
        .collection('users')
        .updateOne(
            { email: session?.user.email },
            { $set: { username: username } }
        )
    if ((await res.matchedCount) === 1) {
        return { ok: true, status: 200 }
    } else {
        return { ok: false, status: 500 }
    }
}

const getStickers = async (request?: { userEmail: string }) => {
    'use server'
    console.log('getStickers')
    const db = await getDatabase()
    const collection = await db.collection('location')
    const res = await collection.count()

    return res
}

const myAccount = async () => {
    const username = await getUserName()

    return (
        <div className="page-container">
            <UserDetails userName={username} updateUsername={updateUsername} />
            <Gloopstatistics getStickers={await getStickers} />
        </div>
    )
}

export default myAccount

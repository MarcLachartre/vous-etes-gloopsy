export const dynamic = 'force-dynamic'
import { getDatabase } from '@/lib/mongo-connection'
import { NextResponse } from 'next/server'

export const GET = async () => {
    const db = await getDatabase()
    const usernames = await db
        .collection('users')
        .find({}, { projection: { _id: 0, username: 1 } })
        .toArray()

    return NextResponse.json(usernames)
}

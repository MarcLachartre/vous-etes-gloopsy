import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb.ts'

export const PATCH = async (request: Request) => {
    const req = await request.json()
    const db = await getDatabase()
    const mongoId = new ObjectId(req.markerId)

    const editComment = async () => {
        return await db.collection('location').updateOne(
            { _id: mongoId },
            {
                $set: {
                    'properties.description': req.formJson.editContent,
                },
            }
        )
    }

    const getMarkers = async () => {
        const response = await fetch(
            `${process.env.DOMAIN}/api/markers/get-markers`,
            {
                method: 'GET',
                headers: {},
                cache: 'no-store',
            }
        )
        return await response.json()
    }

    await editComment()

    const markers = await getMarkers()

    return NextResponse.json({ req, markers })
}

import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongo-connection'

export async function POST(request: Request) {
    const db = await getDatabase()
    const res = await request.json()

    const geoMarker = {
        geometry: {
            type: 'Point',
            coordinates: await res.data.coord,
        },
        properties: {
            owner: await res.data.userName,
            description: await res.data.comment,
            email: await res.data.userEmail,
            date: `${new Date().getDate()}/${
                new Date().getMonth() + 1
            }/${new Date().getFullYear()}`,
            time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
        },
    }

    const saveMarker = async () => {
        const marker = await db.collection('location').insertOne(geoMarker)
        res._id = String(marker.insertedId)
        res.geoMarker = geoMarker
    }

    await saveMarker()

    return NextResponse.json(res)
}

import { NextResponse } from 'next/server.js'
export const dynamic = 'force-dynamic' // prevent caching and loading previous payload
import { getDatabase } from '@/lib/mongo-connection'

export async function GET() {
    const getMarkers = async () => {
        const db = await getDatabase()
        return db
            .collection('location')
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'properties.email',
                        foreignField: 'email',
                        as: 'properties.user',
                    },
                },
            ])
            .toArray()
    }

    const markers = await getMarkers()

    markers.map(function (obj: any) {
        obj.properties.id = obj._id
        return obj
    })

    return NextResponse.json(markers)
}

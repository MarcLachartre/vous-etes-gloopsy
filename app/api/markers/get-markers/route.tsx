'use server'
import { NextResponse } from 'next/server.js'
export const dynamic = 'force-dynamic' // prevent caching and loading previous payload
import { getDatabase } from '/Users/marclachartre/Code/MarcLachartre/mini apps/vous-etes-gloopsy/lib/mongodb.ts'

export async function GET() {
    const getMarkers = async () => {
        const db = await getDatabase()
        return db.collection('location').find().toArray()
    }

    const markers = await getMarkers()

    markers.map(function (obj: any) {
        obj.properties.id = obj._id
        return obj
    })

    return NextResponse.json(markers)
}

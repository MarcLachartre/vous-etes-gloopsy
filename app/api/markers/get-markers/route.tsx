import { MongoClient } from 'mongodb'
import { NextResponse, NextRequest } from 'next/server'
import GlobalConfig from '../../../../app/app.config.js'
export const dynamic = 'force-dynamic'

export async function GET() {
    const client = new MongoClient(process.env.MONGO_URL as string)

    const getMarkers = async () => {
        return await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .find()
            .toArray()
    }

    try {
        // request db without creating a connecting if the app is already connected to mongodb
        const markers = await getMarkers()

        return new Response(JSON.stringify(markers))
    } catch {
        // if the upper try fails, do the same but opening a connection to mongodb
        await client.connect()
        const markers = await getMarkers()

        return new Response(JSON.stringify(markers))
    }
}
// export async function GET() {
//     // we will use params to access the data passed to the dynamic route
//     return new Response(`Welcome to my Next application, user:`)
// }

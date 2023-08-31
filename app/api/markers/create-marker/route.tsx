import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'
import GlobalConfig from '../../../../app/app.config.js'

export async function POST(request: Request) {
    const client = new MongoClient(process.env.MONGO_URL as string)
    const res = await request.json()

    const geoMarker = {
        features: [
            {
                geometry: {
                    type: 'Point',
                    coordinates: await res.data.coord,
                },
                properties: {
                    owner: await res.data.userName,
                    description: await res.data.comment,
                    email: await res.data.userEmail,
                    date: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
                    time: `${new Date().getHours()}h ${new Date().getMinutes()}min ${new Date().getSeconds()}s`,
                },
            },
        ],
    }
    const saveMarker = async () => {
        const marker = await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .insertOne(geoMarker)
        res._id = String(marker.insertedId)
        res.geoMarker = geoMarker
    }

    try {
        // request db without creating a connecting if the app is already connected to mongodb
        await saveMarker()

        return NextResponse.json(res)
    } catch {
        // if the upper try fails, do the same but opening a connection to mongodb
        await client.connect()
        await saveMarker()

        return NextResponse.json(res)
    }
}

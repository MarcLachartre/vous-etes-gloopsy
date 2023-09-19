import { MongoClient, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import GlobalConfig from '../../../../app/app.config.js'

export const PATCH = async (request: Request) => {
    const req = await request.json()

    const client = new MongoClient(process.env.MONGO_URL as string)

    const mongoId = new ObjectId(req.markerId)

    const editComment = async () => {
        return await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .updateOne(
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

    try {
        // request db without creating a connecting if the app is already connected to mongodb
        await editComment()

        const markers = await getMarkers()
        await client.close()

        return NextResponse.json({ req, markers })
    } catch {
        await client.connect()
        await editComment()
        const markers = await getMarkers()

        await client.close()

        return NextResponse.json({ req, markers })
    }
}

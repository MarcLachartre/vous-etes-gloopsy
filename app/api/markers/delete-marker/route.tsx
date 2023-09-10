import { MongoClient, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import GlobalConfig from '../../../../app/app.config.js'

export async function DELETE(request: Request) {
    const client = new MongoClient(process.env.MONGO_URL as string)
    const req = await request.json()
    const id = await req.data.markerId

    const mongoId = new ObjectId(id)

    try {
        // request db without creating a connecting if the app is already connected to mongodb
        await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .deleteOne({ _id: mongoId })

        return NextResponse.json(req)
    } catch {
        // if the upper try fails, do the same but opening a connection to mongodb
        await client.connect()
        await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .deleteOne({ _id: mongoId })

        return NextResponse.json(req)
    }
}

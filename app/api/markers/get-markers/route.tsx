import { MongoClient } from 'mongodb'
import GlobalConfig from '../../../../app/app.config.js'
export const dynamic = 'force-dynamic' // prevent caching and loading previous payload

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

        markers.map(function (obj: any) {
            obj.properties.id = obj._id
            return obj
        })

        await client.close()

        return new Response(JSON.stringify(markers))
    } catch {
        // if the upper try fails, do the same but opening a connection to mongodb
        await client.connect()

        const markers = await getMarkers()

        markers.map(function (obj: any) {
            obj.properties.id = obj._id
            return obj
        })

        await client.close()

        return new Response(JSON.stringify(markers))
    }
}

import { MongoClient, ObjectId } from 'mongodb'
import GlobalConfig from '../../app/app.config.js'

const client = new MongoClient(process.env.MONGO_URL as string)

const editMarker = async (
    id: string,
    coordinates: number[],
    owner: string,
    description: string
) => {
    const mongoId = new ObjectId(id)

    const geoMarker = {
        features: [
            {
                geometry: {
                    type: 'Point',
                    coordinates: coordinates,
                },
                properties: {
                    owner: owner,
                    description: description,
                },
            },
        ],
    }

    try {
        // request db without creating a connecting if the app is already connected to mongodb
        await client.db(GlobalConfig.dbName).collection('location').updateOne(
            { _id: mongoId },
            {
                $set: geoMarker,
            }
        )

        return
    } catch {
        // if the upper try fails, do the same but opening a connection to mongodb
        await client.connect()
        await client.db(GlobalConfig.dbName).collection('location').updateOne(
            { _id: mongoId },
            {
                $set: geoMarker,
            }
        )

        return
    }
}

export default editMarker

import { MongoClient, ObjectId } from 'mongodb'

const url: any = String(process.env.MONGO_URL)
const client = new MongoClient(url)

// Database Name
const dbName = 'gloopsy'

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

    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)

    const collection = await db.collection('location').updateOne(
        { _id: mongoId },
        {
            $set: geoMarker,
        }
    )

    return collection
}

export default editMarker

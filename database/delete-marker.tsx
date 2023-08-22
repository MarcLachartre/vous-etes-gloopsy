import { MongoClient, ObjectId } from 'mongodb'

const url: any = process.env.MONGO_URL
const client = new MongoClient(url)

// Database Name
const dbName = 'gloopsy'

const deleteMarker = async (id: string) => {
    const mongoId = new ObjectId(id)
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)
    const collection = await db
        .collection('location')
        .deleteOne({ _id: mongoId })

    return collection
}

export default deleteMarker

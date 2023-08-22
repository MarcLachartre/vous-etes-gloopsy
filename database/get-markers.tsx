import { MongoClient } from 'mongodb'

// Connection URL
const url: any = process.env.MONGO_URL

const client = new MongoClient(url)

// Database Name
const dbName = 'gloopsy'

const main = async () => {
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)
    const collection = await db.collection('location').find().toArray()

    return collection
}

const getMarkers = async () => {
    const markers = await main()
        .then((success) => {
            return JSON.stringify(success)
        })
        .finally(() => client.close())
    return markers
}

export default getMarkers

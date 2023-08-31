import { MongoClient } from 'mongodb'
import GlobalConfig from '../../app/app.config.js'

const client = new MongoClient(process.env.MONGO_URL as any)

const getMarkers = async () => {
    try {
        const markers = await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .find()
            .toArray()

        return JSON.stringify(markers)
    } catch {
        await client.connect()
        const markers = await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .find()
            .toArray()
        return JSON.stringify(markers)
    }
}

export default getMarkers

import { MongoClient, ObjectId } from 'mongodb'
import GlobalConfig from '../../app/app.config.js'

const client = new MongoClient(process.env.MONGO_URL as string)

const deleteMarker = async (id: string) => {
    const mongoId = new ObjectId(id)

    try {
        // request db without creating a connecting if the app is already connected to mongodb
        const marker = await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .deleteOne({ _id: mongoId })

        return
    } catch {
        // if the upper try fails, do the same but opening a connection to mongodb
        await client.connect()
        const markers = await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .deleteOne({ _id: mongoId })

        return
    }

    return
}

export default deleteMarker

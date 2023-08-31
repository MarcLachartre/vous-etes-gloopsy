// 'use server'
import { MongoClient, Db } from 'mongodb'
import GlobalConfig from '../../app/app.config.js'

const client = new MongoClient(process.env.MONGO_URL as string)

const createMarker = async (
    coordinates: number[],
    owner: string,
    description: string
) => {
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
                    date: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
                    time: `${new Date().getHours()}h ${new Date().getMinutes()}min ${new Date().getSeconds()}s`,
                },
            },
        ],
    }

    try {
        // request db without creating a connecting if the app is already connected to mongodb
        const marker = await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .insertOne(geoMarker)

        return
    } catch {
        // if the upper try fails, do the same but opening a connection to mongodb
        await client.connect()
        const marker = await client
            .db(GlobalConfig.dbName)
            .collection('location')
            .insertOne(geoMarker)

        return marker
    }
}

export default createMarker

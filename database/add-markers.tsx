// import { MongoClient } from 'mongodb'
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

const url: any = process.env.MONGO_URL

const client = new MongoClient(url)

// Database Name
const dbName = 'gloopsy'

const addMarker = async (
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
                },
            },
        ],
    }

    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)
    const collection = await db.collection('location').insertOne(geoMarker)

    return collection
}

export default addMarker

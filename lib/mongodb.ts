'use server'
import { MongoClient } from 'mongodb'
import GlobalConfig from '../app/app.config.js'

let cachedClient: any = null
let timer: any = null

export async function connectToDatabase() {
    if (timer !== null) {
        clearTimeout(timer)
    }

    if (cachedClient !== null && cachedClient.s.hasBeenClosed === true) {
        console.log('re opening mongo db connection')
        await cachedClient.connect()
        console.log('mongo db connection re opened')
    }

    if (cachedClient === null) {
        try {
            console.log('opening mongo db connection')
            const client = new MongoClient(process.env.MONGO_URL as string, {
                connectTimeoutMS: 200000,
                maxIdleTimeMS: 200000,
            })
            await client.connect()
            cachedClient = client
            console.log('mongo db connection created')
        } catch (error) {
            console.error('Error connecting to MongoDB:', error)
            throw new Error('Error connecting to MongoDB')
        }
    }

    timer = setTimeout(async () => {
        // maintains mongo db connection open after 5 minutes
        await cachedClient.close()
        console.log('closing mongo db connection')
        timer = null
        clearTimeout(timer)
    }, 5 * 60 * 1000)

    return cachedClient
}

export async function getDatabase() {
    const client = await connectToDatabase()
    return client.db(GlobalConfig.dbName)
}

export async function disconnectFromDatabase() {
    if (cachedClient) {
        await cachedClient.close()
        console.log('MongoDB connection closed')
        cachedClient = null
    }
}

process.on('SIGTERM', async () => {
    await disconnectFromDatabase()
    process.exit()
})

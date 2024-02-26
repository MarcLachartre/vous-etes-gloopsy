'use server'
import { MongoClient } from 'mongodb'
import GlobalConfig from '../app/app.config.js'

let cachedClient: any = null

async function connectToDatabase() {
    if (!cachedClient) {
        const client = new MongoClient(process.env.MONGO_URL as string)

        console.log('caching db')
        try {
            await client.connect()
            cachedClient = client
            console.log('MongoDB connected')
        } catch (error) {
            console.error('Error connecting to MongoDB:', error)
            throw new Error('Error connecting to MongoDB')
        }
    }
    console.log('cached')
    return cachedClient
}

export async function getDatabase() {
    const client = await connectToDatabase()
    return client.db(GlobalConfig.dbName)
}

export async function disconnectFromDatabase() {
    console.log('func disco')
    console.log(cachedClient)
    if (cachedClient) {
        await cachedClient.close()
        console.log('MongoDB connection closed')
        cachedClient = null
    }
}

process.on('SIGINT', async () => {
    await disconnectFromDatabase()
    process.exit()
})

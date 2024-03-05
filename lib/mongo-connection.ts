'use server'
import { MongoClient as MongoClientObj } from 'mongodb'

import { logColor } from './log-colors'
import GlobalConfig from '../app/app.config.js'

declare global {
    var client: any
    var timer: ReturnType<typeof setTimeout>
    var dbConnected: boolean
}

export const setDatabaseConnectionClient = async () => {
    // Creates the mongo client necessary for opening a connection if it is not created yet
    if (global.client === undefined) {
        console.log(logColor('green', 'creating mongo client'))
        global.client = new MongoClientObj(process.env.MONGO_URL as string, {})
    } else {
        console.log(logColor('blue', 'mongo client already created'))
    }
}

export const connectToDatabase = async () => {
    setDatabaseConnectionClient()
    if (global.dbConnected === false) {
        // Starts the connection if not connected yet
        await global.client.connect()
        global.dbConnected = true
        console.log(logColor('green', 'client connected'))
    }

    // Each time a user needs to connect or use the db, it stops the precedent timer and creates a new.
    clearTimeout(global.timer)
    connectionTimeout(300000)
}

export const connectionTimeout = (duration: number) => {
    // Sets a timer to close connection. This behaves as a connection timeout.
    global.timer = setTimeout(async () => {
        await global.client.close()
        console.log(logColor('red', 'mongo db connection closed'))
        global.dbConnected = false
        clearTimeout(global.timer as ReturnType<typeof setTimeout>)
    }, duration)
}

export async function getDatabase() {
    await connectToDatabase()
    return global.client.db(GlobalConfig.dbName)
}

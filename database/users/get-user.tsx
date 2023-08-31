// import { MongoClient } from 'mongodb'
// import GlobalConfig from '../../app/app.config.js'

// const client = new MongoClient(process.env.MONGO_URL as string)

// const getUser = async (email: string) => {
//     const db = client.db(GlobalConfig.dbName)

//     try {
//         // request db without creating a connecting if the app is already connected to mongodb
//         await client.db(GlobalConfig.dbName)
//         await client.connect()
//         // const markers = await client.db(GlobalConfig.dbName).collection('users')
//         // .insertOne()

//         return
//     } catch {
//         // if the upper try fails, do the same but opening a connection to mongodb
//         await client.connect()
//         // await client.db(GlobalConfig.dbName)

//         return
//     }
// }

// export default getUser

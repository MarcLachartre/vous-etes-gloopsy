import { NextRequest, NextResponse } from 'next/server.js'

export const dynamic = 'force-dynamic' // prevent caching and loading previous payload

import { getDatabase } from '@/lib/mongo-connection'
import { auth } from '@/auth'

export const GET = auth(async () => {
    const getMarkers = async () => {
        const db = await getDatabase()
        // if (req.auth?.user.role === 'MEMBER') {
        return db
            .collection('location')
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'properties.email',
                        foreignField: 'email',
                        as: 'properties.user',
                    },
                },
                {
                    $addFields: {
                        'properties.id': '$_id',
                    },
                },
            ])
            .toArray()
        // }
        // else {
        //     return db
        //         .collection('location')
        //         .aggregate([
        //             {
        //                 $lookup: {
        //                     from: 'users',
        //                     localField: 'properties.email',
        //                     foreignField: 'email',
        //                     as: 'properties.user',
        //                 },
        //             },
        //             {
        //                 $unset: [
        //                     'properties.pictureURL',
        //                 ],
        //             },
        //         ])
        //         .toArray()
        // }
    }

    const markers = await getMarkers()

    return NextResponse.json(markers)
})

// export async function GET() {
//     const getMarkers: () => Promise<any> = async () => {
//         const allLocation = prisma.location.aggregateRaw({
//             pipeline: [
//                 {
//                     $lookup: {
//                         from: 'users',
//                         localField: 'properties.email',
//                         foreignField: 'email',
//                         as: 'properties.user',
//                     },
//                 },
//             ],
//         })

//         return await allLocation
//     }

//     await getMarkers()
//         .then(async (e) => {
//             await prisma.$disconnect()
//             if (e !== null) return e
//             return []
//         })
//         .catch(async (e) => {
//             console.error(e)
//             await prisma.$disconnect()
//             process.exit(1)
//         })

//     const markers = await getMarkers()

//     markers.map(function (obj: any) {
//         obj.properties.id = obj._id
//         return obj
//     })

//     return NextResponse.json(markers)
// }

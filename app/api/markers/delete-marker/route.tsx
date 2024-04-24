import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

import { getDatabase } from '@/lib/mongo-connection'
import { logColor } from '@/lib/log-colors'
import { deleteFromCloudinary } from '../utils/cloudinary/delete'

export async function DELETE(request: Request) {
    const db = await getDatabase()
    const req = await request.formData()
    const id: FormDataEntryValue | null = req.get('markerId')
    const picturePublicId: FormDataEntryValue | null =
        req.get('picturePublicId')

    if (!id || !picturePublicId) {
        console.log(logColor('red', 'Incorrect ids provided'))
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }

    const cloudinaryRes =
        picturePublicId !== 'undefined'
            ? await deleteFromCloudinary(picturePublicId as string)
            : false

    if (cloudinaryRes.result !== 'ok' && cloudinaryRes !== false) {
        console.log(logColor('red', 'pic not found'))
        return NextResponse.json(
            { error: 'Internal Server error' },
            { status: 500 }
        )
    }

    const mongoId = new ObjectId(id as string)
    await db.collection('location').deleteOne({ _id: mongoId })

    return NextResponse.json(req)
}

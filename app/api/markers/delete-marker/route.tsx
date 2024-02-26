'use server'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

import { getDatabase } from '@/lib/mongodb.ts'

export async function DELETE(request: Request) {
    const db = await getDatabase()
    const req = await request.json()
    const id = await req.data.markerId
    const mongoId = new ObjectId(id)

    await db.collection('location').deleteOne({ _id: mongoId })

    return NextResponse.json(req)
}

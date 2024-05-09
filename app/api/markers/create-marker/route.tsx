import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongo-connection'
import DataValidation from '@/lib/data-validation'
// import sharp from 'sharp'
// import { exec } from 'child_process'
import { v2, UploadApiOptions } from 'cloudinary'
import { logColor } from '@/lib/log-colors'
import { submitToCloudinary } from '../utils/cloudinary/submit'
import { compressImages } from '../utils/compress-images'

interface GeoJson {
    geometry: {
        type: FormDataEntryValue | null
        coordinates: number[]
    }
    properties: {
        owner: FormDataEntryValue | null
        description: FormDataEntryValue | null
        email: FormDataEntryValue | null
        date: string
        time: string
        timestamp: number
        picturePublicId?: string
        pictureURL?: string
    }
}

export async function POST(request: Request) {
    console.log(logColor('green', 'start POST req'))
    try {
        const db = await getDatabase()
        const data = await request.formData()

        const pic = data.get('picture') as File

        console.log(logColor('blue', 'start pic validation'))
        if (pic.size > 0) {
            if (!(await isValidPic(pic))) {
                console.log(logColor('red', 'pic is not valid'))
                return NextResponse.json(
                    { error: 'Error validating image' },
                    { status: 500 }
                )
            } else {
                console.log(logColor('green', 'pic is valid'))
            }
        }

        const imageToUpload = pic?.size !== 0 ? await compressImages(pic) : null

        const picUploadRes =
            imageToUpload !== null
                ? await submitToCloudinary(
                      imageToUpload?.buffer,
                      imageToUpload?.type
                  )
                : null

        const coords =
            data.get('coord') !== null ? (data.get('coord') as string) : '[,]'
        const coord = (i: 0 | 1) => {
            return Number(coords.substring(1, coords.length - 1).split(',')[i])
        }

        const geoMarker: GeoJson = {
            geometry: {
                type: 'Point',
                coordinates: [coord(0), coord(1)],
            },
            properties: {
                owner: data.get('userName'),
                description: data.get('comment'),
                email: data.get('userEmail'),
                date: `${new Date().getDate()}/${
                    new Date().getMonth() + 1
                }/${new Date().getFullYear()}`,
                time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                timestamp: Date.now(),
            },
        }

        if (picUploadRes !== null && picUploadRes.asset_id !== null) {
            geoMarker.properties.picturePublicId = picUploadRes?.public_id
            geoMarker.properties.pictureURL = picUploadRes?.secure_url
        }

        const res: { geoMarker: GeoJson; _id: string } = {
            geoMarker: geoMarker,
            _id: 'undefined',
        }

        const saveMarker = async () => {
            const marker = await db.collection('location').insertOne(geoMarker)
            res._id = String(marker.insertedId)
            res.geoMarker = geoMarker
        }

        await saveMarker()

        return NextResponse.json(res)
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 })
    }
}

const isValidPic = async (file: File) => {
    const validation = new DataValidation(file)
    await validation.validatePictureType()
    await validation.validatePictureSize()

    return validation.isValid
}

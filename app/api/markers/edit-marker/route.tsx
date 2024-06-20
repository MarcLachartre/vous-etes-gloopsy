import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongo-connection'
import { logColor } from '@/lib/log-colors'
import DataValidation from '@/lib/data-validation'
import { submitToCloudinary } from '../utils/cloudinary/submit'
import { compressImages } from '../utils/compress-images'
import { auth } from '@/auth'

export const PATCH = auth(async (request) => {
    // const session = request.auth
    // console.log(session)
    // // if (!session || session.user)
    console.log(logColor('green', 'start PATCH req'))
    const req = await request.formData()
    const db = await getDatabase()

    const id = req.get('markerId') as string
    const comment = req.get('editContent') as string
    const picture = req.get('picture') as File
    const picturePublicId = req.get('picturePublicId') as string
    const pictureURL = req.get('pictureURL') as string
    const mongoId = new ObjectId(id)

    const editComment = async (
        picturePublicId?: string,
        pictureURL?: string
    ) => {
        console.log('edit comment')

        const editValue = pictureURL
            ? {
                  'properties.description': comment,
                  'properties.pictureURL': pictureURL + '?' + Date.now(),
                  'properties.picturePublicId': picturePublicId,
              }
            : {
                  'properties.description': comment,
              }

        return await db.collection('location').updateOne(
            { _id: mongoId },
            {
                $set: editValue,
            }
        )
    }

    if (picture !== undefined && picture.size > 0) {
        console.log('a pic is provided')
        if (!(await isValidPic(picture))) {
            // validation of the pic data
            console.log(logColor('red', 'pic is not valid'))
            return NextResponse.json(
                { error: 'Error validating image' },
                { status: 500 }
            )
        } else {
            console.log(logColor('green', 'pic is valid'))
        }

        const imageToUpload = // compressing the pic
            picture?.size !== 0 ? await compressImages(picture) : null

        if (pictureURL === 'undefined') {
            // if the marker does not have a pic, submit pic to cloudinary
            console.log('marker doesnt contain a pic yet')
            const picUploadRes =
                imageToUpload !== null
                    ? await submitToCloudinary(
                          imageToUpload?.buffer,
                          imageToUpload?.type
                      )
                    : null
            editComment(
                await picUploadRes.public_id,
                await picUploadRes.secure_url
            )
        } else {
            console.log('marker contains a pic ')
            const picUploadRes =
                imageToUpload !== null
                    ? await submitToCloudinary(
                          imageToUpload?.buffer,
                          imageToUpload?.type,
                          picturePublicId
                      )
                    : null
            editComment(picUploadRes.public_id, await picUploadRes.secure_url)
        }
    } else {
        console.log('no pic provided')
        editComment()
    }

    const getMarkers = async () => {
        const response = await fetch(
            `${process.env.DOMAIN}/api/markers/get-markers`,
            {
                method: 'GET',
                headers: {},
                cache: 'no-store',
            }
        )
        return await response.json()
    }

    const markers = await getMarkers()

    return NextResponse.json({ req, markers })
})

const isValidPic = async (file: File) => {
    const validation = new DataValidation(file)
    await validation.validatePictureType()
    await validation.validatePictureSize()

    return validation.isValid
}

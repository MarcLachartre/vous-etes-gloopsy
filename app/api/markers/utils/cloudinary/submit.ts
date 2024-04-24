import { logColor } from '@/lib/log-colors'
import { UploadApiOptions, v2 } from 'cloudinary'

const submitToCloudinary = async (
    base64File: Buffer,
    type: string,
    publicId?: string
) => {
    console.log(logColor('blue', 'start pic submit'))
    if (!base64File) {
        console.log(logColor('blue', 'no pic to submit'))
        console.log(logColor('blue', 'end pic submit'))
        return
    }

    v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const timestamp = String(Date.now())

    console.log('publicId = ' + typeof publicId)
    const options: UploadApiOptions =
        publicId !== undefined // if a public id is provided, the image uploaded needs to replace the image with the same id in cloudinary
            ? {
                  timeout: 120000,
                  public_id: publicId,
                  folder: 'vous-etes-gloopsy',
                  overwrite: true,
                  invalidate: true,
              }
            : {
                  // if not, create image in cloudinary
                  timeout: 120000,
                  public_id: timestamp,
                  folder: 'vous-etes-gloopsy',
              }

    const res = await v2.uploader
        .upload(`data:${type};base64,${base64File.toString('base64')}`, options)
        .then((r) => {
            console.log(logColor('green', 'pic submit successfull'))
            console.log(r)
            return r
        })
        .catch((e) => {
            console.log(logColor('red', 'error submitting pic'))
            console.log(e)
            return e
        })

    console.log(logColor('blue', 'end pic submit'))
    return res
}

export { submitToCloudinary }

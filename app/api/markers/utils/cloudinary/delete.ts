import { v2 } from 'cloudinary'

const deleteFromCloudinary = async (publicId: string) => {
    v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const res = await v2.uploader.destroy(publicId, { invalidate: true })
    return res
}

export { deleteFromCloudinary }

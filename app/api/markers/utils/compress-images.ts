import { logColor } from '@/lib/log-colors'
import sharp from 'sharp'

const compressImages = async (file: File) => {
    console.log(logColor('blue', 'start compressing'))

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const base64File = Buffer.from(buffer)

    if (file.size / 1000 <= 100) {
        console.log(logColor('blue', 'no compressing needed'))
        console.log(logColor('blue', 'end compressing'))
        return { buffer: base64File, type: file.type }
    }

    const compressedFile = await sharp(base64File)
        .withMetadata()
        .resize(600)
        .png({ quality: 25, palette: true })
        .toBuffer()

    console.log(logColor('blue', 'end compressing'))
    // const compressedFile2 = await sharp(base64File)
    //     .png({ quality: 3, palette: true })
    //     .toFile('./aaa.png')
    //     .then(() => {
    //         let sizeBeforeCompression: any, sizeAfterCompression: any

    //         const sizeAfterCompressionCommand = `du -h ./aaa.png`

    //         exec(sizeAfterCompressionCommand, (err, stdout, stderr) => {
    //             sizeAfterCompression = stdout.split('\\t')[0]
    //             console.log(sizeAfterCompression)
    //         })
    //     })
    // console.log(compressedFile2)

    return { buffer: Buffer.from(compressedFile), type: 'image/png' }
}

export { compressImages }

'use client'
import { Button, dividerClasses } from '@mui/material'
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import { styled } from '@mui/material/styles'
import styles from '../../css/utils/add-picture-button.module.scss'
import FormHelperText from '@mui/material/FormHelperText'
import DataValidation from '@/lib/data-validation'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
    ChangeEvent,
    useEffect,
    useRef,
    useState,
    ReactElement,
    JSXElementConstructor,
} from 'react'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

const AddPicture = ({
    editPic,
    picURLToEdit,
}: {
    editPic: boolean
    picURLToEdit?: string
}) => {
    const [pictureValidation, setPictureValidation] = useState<{
        data?: any
        isValid?: boolean | null
        error?: string[]
    }>()
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false)
    const [message, setMessage] = useState<
        ReactElement<undefined, JSXElementConstructor<Element>>
    >(<div key={'add-pic-empty'} style={{ display: 'none' }}></div>)

    const refFile = useRef<HTMLInputElement>(null)

    const startValidation = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]

        const validation = new DataValidation(file)
        await validation.validatePictureType()
        await validation.validatePictureSize()

        // console.log(file)
        // const compressedFile = await compressImage(file, {
        //     // 0: is maximum compression
        //     // 1: is no compression
        //     quality: 0.8,

        //     // We want a JPEG file
        //     type: 'image/jpeg',
        // })

        setPictureValidation(validation)
    }

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        console.log('validate file')
        console.log(e.target.files)
        e.target.files!.length === 0 ? resetInput() : startValidation(e)
    }

    const resetInput = () => {
        setIsFileSelected(false)
        if (refFile !== null && refFile.current !== null) {
            refFile.current.value = ''
            setMessage(
                <div key={'add-pic-empty'} style={{ display: 'none' }}></div>
            )
        }
    }

    const displayPicName = () => {
        setIsFileSelected(true)
        setMessage(
            <div className={styles.picMessageContainer} key={'add-pic-name'}>
                <FormHelperText
                    style={{
                        alignSelf: 'flex-start',
                        marginLeft: '10px',
                        marginRight: '10px',
                        marginTop: '0px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textTransform: 'lowercase',
                    }}
                >
                    {pictureValidation?.data.name}
                </FormHelperText>
                <CloseRoundedIcon
                    fontSize="small"
                    sx={{
                        '&:hover ': {
                            cursor: 'pointer',
                        },
                    }}
                    onClick={resetInput}
                />
            </div>
        )
    }

    const displayPicError = () => {
        console.log('error')
        resetInput()
        setMessage(
            <FormHelperText
                key={'add-pic-error'}
                style={{
                    width: '100%',
                    color: 'red',
                    alignSelf: 'flex-start',
                    marginLeft: '10px',
                }}
            >
                {pictureValidation?.error
                    ? 'Fichier invalide. ' + pictureValidation?.error[0]
                    : ''}
            </FormHelperText>
        )
    }

    useEffect(() => {
        if (pictureValidation) {
            pictureValidation.isValid ? displayPicName() : displayPicError()
        }
    }, [pictureValidation])

    return [
        editPic && !isFileSelected ? (
            <img src={picURLToEdit} key="image-to-edit" />
        ) : null,
        <Button
            key={'picture-button'}
            component="label"
            fullWidth
            role={undefined}
            // disabled
            variant="outlined"
            tabIndex={-1}
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <div className={styles.innerPicButton}>
                <div>{editPic ? 'Changer photo' : 'Ajouter photo'}</div>
                <VisuallyHiddenInput
                    type="file"
                    name="picture"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    ref={refFile}
                />
                <AddAPhotoRoundedIcon />
            </div>
        </Button>,
        message,
    ]
}

export default AddPicture

// const compressImage = async (file: File, { quality = 1, type = file.type }) => {
// // Get as image data
// const imageBitmap = await createImageBitmap(file)

// // Draw to canvas
// const canvas = document.createElement('canvas')
// canvas.width = imageBitmap.width
// canvas.height = imageBitmap.height
// const ctx = canvas.getContext('2d')
// ctx!.drawImage(imageBitmap, 0, 0)

// // Turn into Blob
// const blob: any = await new Promise((resolve) =>
//     canvas.toBlob(resolve, type, quality)
// )

// console.log(
//     new File([blob], file.name, {
//         type: blob.type,
//     })
// )
// Turn Blob into File

// return new File([blob], file.name, {
//     type: blob.type,
// })
// }

import styles from '../../css/input-box.module.scss'
import adrien from '../../css/adrien.module.scss'

import {
    useEffect,
    useState,
    useContext,
    Dispatch,
    SetStateAction,
} from 'react'
import { MapContext } from '@/context/map-context'
import Button from '@mui/material/Button'
import AddPicture from './add-picture'

const EditMarkerBox = (props: {
    markerId: string
    comment: string
    pictureURL: string
    picturePublicId: string
    edit: (formData: FormData) => Promise<any>
    setShowAllMarkers: Dispatch<SetStateAction<boolean>>
    setShowEditBox: Dispatch<SetStateAction<boolean>>
}) => {
    const map = useContext(MapContext)
    const [editBox, setEditBox] = useState(<div></div>)
    const [editBoxType, setEditBoxType] = useState('default')

    const editMarker = async (e: any) => {
        e.preventDefault()
        props.setShowAllMarkers(true)
        setEditBoxType('loading')
        const form = e.target

        const formData = new FormData(form)
        formData.append('markerId', props.markerId)
        formData.append('pictureURL', props.pictureURL)
        formData.append('picturePublicId', props.picturePublicId)

        const response = await props.edit(formData)

        const { status, markers } = await response

        if (status === 200) {
            map.getSource('vous-etes-gloopsy').setData({
                type: 'FeatureCollection',
                features: markers,
            })
            setEditBoxType('all good')
        } else {
            setEditBoxType('error')
        }
    }

    useEffect(() => {
        switch (editBoxType) {
            case 'default':
                setEditBox(
                    <div className={styles.inputBox}>
                        <h5>Editer</h5>

                        <form onSubmit={editMarker}>
                            <textarea
                                name="editContent"
                                defaultValue={props.comment}
                            />

                            <AddPicture
                                editPic={!!props.pictureURL}
                                picURLToEdit={props.pictureURL}
                            />
                            <div className={styles.rowInputs}>
                                <Button
                                    variant="outlined"
                                    type="submit"
                                    fullWidth
                                >
                                    valider
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {
                                        props.setShowEditBox(false)
                                    }}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    </div>
                )
                break
            case 'loading':
                setEditBox(
                    <div className={styles.inputBox}>
                        <img
                            src="/adrien.png"
                            alt="adrien-wait"
                            className={adrien.loadingAdrien}
                        />
                    </div>
                )
                break
            case 'all good':
                setEditBox(
                    <div className={styles.inputBox}>
                        <h5> Eh merci mec! </h5>
                        <div className={styles.rowInputs}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => {
                                    props.setShowEditBox(false)
                                }}
                            >
                                Retour à la carte
                            </Button>
                        </div>
                    </div>
                )
                break

            case 'error':
                setEditBox(
                    <div className={styles.inputBox}>
                        <p>
                            Oups! Quelque chose ne s'est pas bien passé! Try
                            again!
                        </p>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => {
                                props.setShowEditBox(false)
                            }}
                        >
                            Retour à la carte
                        </Button>
                    </div>
                )
                break
        }
    }, [editBoxType])

    return <div className={styles.inputBoxContainer}>{editBox}</div>
}

export default EditMarkerBox

import styles from '../../css/input-box.module.scss'
import adrien from '../../css/adrien.module.scss'
import {
    useEffect,
    useState,
    useContext,
    Dispatch,
    SetStateAction,
} from 'react'
import { MarkersAmountStateContext } from '@/context/markers-amount-context'
import Button from '@mui/material/Button'

const DeleteMarkerBox = (props: {
    markerId: string
    picturePublicId: string
    resetMarkers: Function
    delete: (formData: FormData) => Promise<any>
    setShowDeleteBox: Dispatch<SetStateAction<boolean>>
    setShowAllMarkers: Dispatch<SetStateAction<boolean>>
}) => {
    const { markersAmount, setMarkersAmount } = useContext(
        MarkersAmountStateContext
    )

    const [deleteBoxType, setDeleteBoxType] = useState('default')
    const [deleteBox, setDeleteBox] = useState(<div></div>)

    const deleteMarker = async () => {
        props.setShowAllMarkers(true)
        setDeleteBoxType('loading')

        const formData = new FormData()
        formData.append('markerId', props.markerId)
        formData.append('picturePublicId', props.picturePublicId)

        const response = await props.delete(formData)

        if (response.status === 200) {
            await props.resetMarkers()
            markersAmount !== null ? setMarkersAmount(markersAmount - 1) : false
            setDeleteBoxType('all good')
        } else {
            setDeleteBoxType('error')
            console.log('error with delete')
        }
    }

    useEffect(() => {
        switch (deleteBoxType) {
            case 'default':
                setDeleteBox(
                    <div className={styles.inputBox}>
                        <h5>Supprimer le pin?</h5>
                        <div className={styles.rowInputs}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={function () {
                                    deleteMarker()
                                }}
                            >
                                oui
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={function () {
                                    props.setShowDeleteBox(false)
                                }}
                            >
                                non
                            </Button>
                        </div>
                    </div>
                )
                break
            case 'loading':
                setDeleteBox(
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
                setDeleteBox(
                    <div className={styles.inputBox}>
                        <h5> Eh merci mec! </h5>
                        <div className={styles.rowInputs}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={function () {
                                    props.setShowDeleteBox(false)
                                }}
                            >
                                retour
                            </Button>
                        </div>
                    </div>
                )
                break

            case 'error':
                setDeleteBox(
                    <div className={styles.inputBox}>
                        <p>
                            Oups! Quelque chose ne s'est pas bien passé! Try
                            again!
                        </p>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={function () {
                                props.setShowDeleteBox(false)
                            }}
                        >
                            retour
                        </Button>
                    </div>
                )
                break
        }
    }, [deleteBoxType])

    return <div className={styles.inputBoxContainer}>{deleteBox}</div>
}

export default DeleteMarkerBox

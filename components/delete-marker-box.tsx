import styles from '../css/input-box.module.scss'
import button from '../css/button.module.scss'
import adrien from '../css/adrien.module.scss'

import { useEffect, useState, useContext } from 'react'
import { MapContext } from '@/context/map-context'

const DeleteMarkerBox = (props: any) => {
    const map = useContext(MapContext)
    const [deleteBoxType, setDeleteBoxType] = useState('default')
    const [deleteBox, setDeleteBox] = useState(<div></div>)

    const deleteMarker = async () => {
        props.setShowAllMarkers(true)
        setDeleteBoxType('loading')
        const response = await fetch('/api/markers/delete-marker', {
            method: 'DELETE',
            body: JSON.stringify({
                data: {
                    markerId: props.markerId,
                },
            }),
        })

        if (response.status === 200) {
            await props.resetMarkers()
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
                            <div
                                className={button.button}
                                onClick={() => {
                                    deleteMarker()
                                }}
                            >
                                <p>Oui</p>
                            </div>
                            <div
                                className={button.button}
                                onClick={() => {
                                    props.setShowDeleteBox(false)
                                }}
                            >
                                <p>Non</p>
                            </div>
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
                            <div
                                className={button.button}
                                onClick={() => {
                                    props.setShowDeleteBox(false)
                                }}
                            >
                                <p>Retour à la carte</p>
                            </div>
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
                        <div
                            className={button.button}
                            onClick={() => {
                                props.setShowDeleteBox(false)
                            }}
                        >
                            <p>Retour à la carte</p>
                        </div>
                    </div>
                )
                break
        }
    }, [deleteBoxType])

    return <div className={styles.inputBoxContainer}>{deleteBox}</div>
}

export default DeleteMarkerBox

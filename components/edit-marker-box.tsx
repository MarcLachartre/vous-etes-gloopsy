import styles from '../css/input-box.module.scss'
import button from '../css/button.module.scss'
import adrien from '../css/adrien.module.scss'

import { useEffect, useState, useContext } from 'react'
import { MapContext } from '@/context/map-context'

const EditMarkerBox = (props: any) => {
    const map = useContext(MapContext)
    const [editBox, setEditBox] = useState(<div></div>)
    const [editBoxType, setEditBoxType] = useState('default')

    const editMarker = async (e: any) => {
        e.preventDefault()
        setEditBoxType('loading')
        const form = e.target

        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries())

        const response = await fetch('/api/markers/edit-marker', {
            method: 'PATCH',
            body: JSON.stringify({ formJson, markerId: props.markerId }),
            headers: {},
        })
        const res = await response.json()

        if (response.status === 200) {
            map.getSource('vous-etes-gloopsy').setData({
                type: 'FeatureCollection',
                features: res.markers,
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
                        <h5>Modifie ton commentaire</h5>

                        <form onSubmit={editMarker}>
                            <textarea
                                name="editContent"
                                defaultValue={props.comment}
                            />
                            <div className={styles.rowInputs}>
                                <button type="submit" className={button.button}>
                                    <p>Valider</p>
                                </button>
                                <div
                                    className={button.button}
                                    onClick={() => {
                                        props.setShowEditBox(false)
                                    }}
                                >
                                    <p>Annuler</p>
                                </div>
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
                            <div
                                className={button.button}
                                onClick={() => {
                                    props.setShowEditBox(false)
                                }}
                            >
                                <p>Retour à la carte</p>
                            </div>
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
                        <div
                            className={button.button}
                            onClick={() => {
                                props.setShowEditBox(false)
                            }}
                        >
                            <p>Retour à la carte</p>
                        </div>
                    </div>
                )
                break
        }
    }, [editBoxType])

    return <div className={styles.inputBoxContainer}>{editBox}</div>
}

export default EditMarkerBox

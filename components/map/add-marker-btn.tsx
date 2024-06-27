'use client'
import { MarkersAmountStateContext } from '@/context/markers-amount-context'

import style from '../../css/map-page/add-marker.module.scss'
import adrien from '../../css/adrien.module.scss'
import SearchAddress from './search-address'
import AddPicture from './add-picture'
import mapboxgl from 'mapbox-gl'

import { useSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'

import { useContext } from 'react'
import { MapContext } from '@/context/map-context'

import Button from '@mui/material/Button'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TextField from '@mui/material/TextField'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded'

const addMarkerBtn = (props: any) => {
    const session = useSession()
    const user = session.data?.user

    const { markersAmount, setMarkersAmount } = useContext(
        MarkersAmountStateContext
    )
    const map = useContext(MapContext)

    const [inputType, setInputType] = useState(<div></div>)
    const [inputName, setInputName] = useState('close')
    const [coords, setCoords] = useState<number[]>([])
    const [marker, setMarker] = useState({} as any)
    const [isClickable, setIsClickable] = useState(false)
    const [crossDisplay, setCrossDisplay] = useState<string>('none')
    const isClickableRef = useRef(false)
    isClickableRef.current = isClickable

    const locateMe = async () => {
        console.log('attempt locate me')

        const success = (position: any) => {
            setInputName('validate location')

            map.flyTo({
                center: [position.coords.longitude, position.coords.latitude], // Fly to the selected target
                duration: 3000,
                essential: true,
                zoom: 17,
            })

            setCoords([position.coords.longitude, position.coords.latitude])
            setIsClickable(true)
            map.getCanvas().style.cursor = 'pointer'
        }

        const error = () => {
            setInputName('error')
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }

        map.removeControl(props.GeolocateControl) // remove and re add geolocate control in order for the navigator.geolocation.getCurrentPosition() function to work, if not, we get an error
        navigator.geolocation.getCurrentPosition(success, error, options)
        map.addControl(props.GeolocateControl)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const username = () => {
            return props.user.username === undefined ||
                props.user.username === null
                ? props.user.name
                : props.user.username
        }

        formData.append('coord', JSON.stringify(coords))
        formData.append(
            'userName',
            username().charAt(0).toUpperCase() + username().slice(1)
        )
        formData.append('userEmail', props.user.email)

        const response = await props.createMarker(formData)
        const res = await response

        if (res.status === 200) {
            await props.resetMarkers()
            markersAmount !== null ? setMarkersAmount(markersAmount + 1) : false

            setInputName('marker added')
        } else {
            setInputName('error')
        }
    }

    useEffect(() => {
        if (coords.length !== 0 && Object.keys(marker).length === 0) {
            const el = document.createElement('div')
            el.className = 'marker'

            const marker = new mapboxgl.Marker(el)
                .setLngLat([coords[0], coords[1]])
                .addTo(map as any)

            setMarker(marker)
        } else if (Object.keys(marker).length !== 0) {
            marker.setLngLat([coords[0], coords[1]])
        }
    }, [coords])

    useEffect(() => {
        if (Object.keys(map).length !== 0) {
            map.on('load', () => {
                map.on('click', (e: any) => {
                    if (isClickableRef.current === true) {
                        setCoords([e.lngLat.lng, e.lngLat.lat])
                    }
                })
            })
        }
    }, [isClickable, map])

    useEffect(() => {
        switch (inputName) {
            case 'close':
                Object.keys(marker).length !== 0 ? marker.remove() : false
                Object.keys(marker).length !== 0 ? setMarker({}) : false
                Object.keys(map).length !== 0
                    ? (map.getCanvas().style.cursor = '')
                    : false
                setCoords([])
                setIsClickable(false)
                setCrossDisplay('none')
                setInputType(<div></div>)
                break

            case 'add marker method selector':
                setCrossDisplay('flex')
                if (!user) {
                    setInputType(
                        <div className={style.inputType}>
                            <p>Connecte toi pour ajouter un pin</p>
                            <a href="/api/auth/signin">Sign in</a>
                            <img
                                src="/adrien.png"
                                alt="adrien"
                                className={adrien.hiAdrien}
                            />
                        </div>
                    )
                } else if (!!user && user.role !== 'MEMBER') {
                    setInputType(
                        <div className={style.inputType}>
                            <h6>Acces refusé</h6>
                            <p>
                                Vous n'êtes pas autorisé à réaliser cette
                                action.{' '}
                            </p>
                            <p>
                                Merci de contacter le developpeur pour en savoir
                                plus.
                            </p>
                        </div>
                    )
                } else {
                    props.setShowAllMarkers(true)
                    setInputType(
                        <div className={style.inputType}>
                            <p>Comment souhaites-tu sticker?</p>
                            <div className={style.localisationChoiceContainer}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={function () {
                                        setInputName('localisation ongoing')
                                    }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>Me localiser</div>
                                    <MyLocationIcon fontSize="small" />
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={function () {
                                        setInputName('manual localisation')
                                    }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>Manuellement</div>{' '}
                                    <PanToolAltIcon fontSize="small" />
                                </Button>
                            </div>
                        </div>
                    )
                }
                break

            case 'localisation ongoing':
                locateMe()
                setCrossDisplay('none')
                setInputType(
                    <div className={style.inputType}>
                        <img
                            src="/adrien.png"
                            alt="adrien-wait"
                            className={adrien.loadingAdrien}
                        />
                    </div>
                )
                break

            case 'validate location':
                setCrossDisplay('flex')
                setInputType(
                    <div className={style.inputType}>
                        <p>Clique pour ajuster la position si besoin!</p>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={function () {
                                setInputName('add comment')
                            }}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>Valider position</div>
                            <PinDropOutlinedIcon fontSize="small" />
                        </Button>
                    </div>
                )
                break

            case 'manual localisation':
                setCrossDisplay('flex')
                setIsClickable(true)
                map.getCanvas().style.cursor = 'pointer'

                setInputType(
                    <div className={style.inputType}>
                        <p style={{ textAlign: 'center' }}>
                            Clique sur la map pour sticker!
                        </p>
                        <SearchAddress setCoords={setCoords} />
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={function () {
                                setInputName('add comment')
                            }}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>Valider position</div> <PinDropOutlinedIcon />
                        </Button>
                    </div>
                )

                break

            case 'add comment':
                setCrossDisplay('flex')
                setIsClickable(false)
                map.getCanvas().style.cursor = ''
                if (coords.length === 0) {
                    setInputName('manual localisation')
                } else {
                    setInputType(
                        <form
                            onSubmit={handleSubmit}
                            className={style.inputType}
                        >
                            <p>Ajoute un commentaire et/ou une photo</p>
                            <TextField
                                name="comment"
                                id="outlined-multiline-static"
                                label="Commentaire"
                                multiline
                                fullWidth
                                placeholder="Un petit commentaire et c'est tout bon! 😊 (max 300 charactères)"
                                rows={4}
                            />
                            <AddPicture editPic={false} />
                            <Button
                                type="submit"
                                variant="outlined"
                                fullWidth
                                onClick={function () {
                                    setInputName('loading')
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div>Enregistrer</div>{' '}
                                <CheckCircleOutlineIcon />
                            </Button>
                        </form>
                    )
                }
                break

            case 'loading':
                setCrossDisplay('none')
                setInputType(
                    <div className={style.inputType}>
                        <img
                            src="/adrien.png"
                            alt="adrien-wait"
                            className={adrien.loadingAdrien}
                        />
                    </div>
                )
                break

            case 'marker added':
                setCrossDisplay('flex')
                marker.remove()
                setMarker({})
                props.setShowAllMarkers(true)
                setInputType(
                    <div className={style.inputType}>
                        <h5> Eh merci mec! </h5>
                    </div>
                )

                setTimeout(() => {
                    setInputName('close')
                }, 3000)
                break

            case 'error':
                Object.keys(marker).length !== 0 ? marker.remove() : false
                Object.keys(marker).length !== 0 ? setMarker({}) : false
                setCoords([])
                setIsClickable(false)
                map.getCanvas().style.cursor = ''
                setInputType(
                    <div className={style.inputType}>
                        <p>
                            Oups! Quelque chose ne s'est pas bien passé! Try
                            again!
                        </p>
                    </div>
                )
                setTimeout(() => {
                    setInputName('close')
                }, 3000)
        }
    }, [inputName, session])

    return (
        <>
            <div className={style.addMarkerContainer}>
                <Button
                    className={style.mobileAddMarkerButton}
                    onClick={() => {
                        setCrossDisplay('flex')
                        inputName === 'close'
                            ? setInputName('add marker method selector')
                            : setInputName('close')
                    }}
                    variant="contained"
                    size="large"
                    style={{
                        display: 'none',
                        backgroundColor: 'var(--default-red)',
                        borderRadius: 'var(--border-radius)',
                    }}
                    endIcon={
                        <AddLocationAltRoundedIcon
                            style={{
                                color: 'white',
                            }}
                            fontSize="large"
                        />
                    }
                >
                    nouveau sticker
                </Button>
                <div
                    className={style.buttonContainer}
                    onClick={() => {
                        inputName === 'close'
                            ? setInputName('add marker method selector')
                            : setInputName('close')
                    }}
                >
                    <p> Ajouter nouveau sticker </p>

                    <img
                        className={style.addMarkerImage}
                        src="/image.png"
                        alt="vous-etes-gloopsy-logo"
                    />
                </div>
                <div className={style.inputTypeContainer}>
                    <div
                        className={style.closeInputContainer}
                        style={{ display: crossDisplay }}
                    >
                        <CloseRoundedIcon
                            onClick={() => {
                                setInputName('close')
                                setCrossDisplay('none')
                            }}
                            sx={{ fontSize: '16px' }}
                        />
                    </div>
                    {inputType}
                </div>
            </div>
        </>
    )
}

export default addMarkerBtn

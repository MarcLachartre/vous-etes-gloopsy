'use client'
import { MarkersAmountStateContext } from '@/context/markers-amount-context'

import style from '../../css/main-page/add-marker.module.scss'
import adrien from '../../css/adrien.module.scss'
import SearchAddress from './search-address'
import mapboxgl from 'mapbox-gl'

import { getSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'

import { useContext } from 'react'
import { MapContext } from '@/context/map-context'

import Button from '@mui/material/Button'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TextField from '@mui/material/TextField'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'

const addMarkerBtn = (props: any) => {
    const { markersAmount, setMarkersAmount } = useContext(
        MarkersAmountStateContext
    )
    const map = useContext(MapContext)

    const [isLoggedIn, setLoggedIn] = useState(false)
    const [inputType, setInputType] = useState(<div></div>)
    const [inputName, setInputName] = useState('close')
    const [coords, setCoords] = useState<number[]>([])
    const [marker, setMarker] = useState({} as any)
    const [isClickable, setIsClickable] = useState(false)
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
        const formJson = Object.fromEntries(formData.entries())

        const username = () => {
            return props.user.user.username === undefined ||
                props.user.user.username === null
                ? props.user.user.name
                : props.user.user.username
        }

        const response = await fetch('/api/markers/create-marker', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    coord: coords,
                    userName:
                        username().charAt(0).toUpperCase() +
                        username().slice(1),
                    userEmail: props.user.user.email,
                    comment: formJson.comment,
                },
            }),
            headers: {},
        })

        if (response.status === 200) {
            await props.resetMarkers()
            markersAmount !== null ? setMarkersAmount(markersAmount + 1) : false

            setInputName('marker added')
        } else {
            setInputName('error')
        }
    }

    useEffect(() => {
        // check if user is logged in
        const checkSession = async () => {
            ;(await getSession()) !== null
                ? setLoggedIn(true)
                : setLoggedIn(false)
        }
        checkSession()
    }, [])

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
                setInputType(<div></div>)
                break

            case 'add marker method selector':
                if (isLoggedIn === false) {
                    setInputType(
                        <div className={style.inputTypeContainer}>
                            <h6>Connecte toi pour ajouter un pin</h6>
                            <a href="/api/auth/signin">Sign in</a>
                            <img
                                src="/adrien.png"
                                alt="adrien"
                                className={adrien.hiAdrien}
                            />
                        </div>
                    )
                } else {
                    props.setShowAllMarkers(true)
                    setInputType(
                        <div className={style.inputTypeContainer}>
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
                                    <div>Ma position</div>
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
                                    <div>Entrer adresse</div>{' '}
                                    <PanToolAltIcon fontSize="small" />
                                </Button>
                            </div>
                        </div>
                    )
                }
                break

            case 'localisation ongoing':
                locateMe()
                setInputType(
                    <div className={style.inputTypeContainer}>
                        <img
                            src="/adrien.png"
                            alt="adrien-wait"
                            className={adrien.loadingAdrien}
                        />
                    </div>
                )
                break

            case 'validate location':
                setInputType(
                    <div className={style.inputTypeContainer}>
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
                setIsClickable(true)
                map.getCanvas().style.cursor = 'pointer'

                setInputType(
                    <div className={style.inputTypeContainer}>
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
                setIsClickable(false)
                map.getCanvas().style.cursor = ''
                if (coords.length === 0) {
                    setInputName('manual localisation')
                } else {
                    setInputType(
                        <form
                            className={style.inputTypeContainer}
                            onSubmit={handleSubmit}
                        >
                            <TextField
                                name="comment"
                                id="outlined-multiline-static"
                                label="Commentaire"
                                multiline
                                fullWidth
                                placeholder="Un petit commentaire et c'est tout bon! 😊 (max 300 charactères)"
                                rows={4}
                            />

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
                setInputType(
                    <div className={style.inputTypeContainer}>
                        <img
                            src="/adrien.png"
                            alt="adrien-wait"
                            className={adrien.loadingAdrien}
                        />
                    </div>
                )
                break

            case 'marker added':
                marker.remove()
                setMarker({})
                props.setShowAllMarkers(true)
                setInputType(
                    <div className={style.inputTypeContainer}>
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
                    <div className={style.inputTypeContainer}>
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
    }, [inputName, isLoggedIn])

    return (
        <div className={style.addMarkerContainer}>
            <div
                className={style.buttonContainer}
                onClick={() => {
                    inputName === 'close'
                        ? setInputName('add marker method selector')
                        : setInputName('close')
                }}
            >
                <h6> Ajouter nouveau sticker </h6>

                <img
                    className={style.addMarkerImage}
                    src="/image.png"
                    alt="vous-etes-gloopsy-logo"
                />
            </div>
            {inputType}
        </div>
    )
}

export default addMarkerBtn

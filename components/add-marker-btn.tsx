'use client'
import buttonStyle from '../css/button.module.scss'
import style from '../css/add-marker.module.scss'
import adrien from '../css/adrien.module.scss'

import mapboxgl from 'mapbox-gl'

import { getSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'

import { useContext } from 'react'
import { MapContext } from '@/context/map-context'

const addMarkerBtn = (props: any) => {
    const map = useContext(MapContext)

    const [isLoggedIn, setLoggedIn] = useState(false)
    const [inputType, setInputType] = useState(<div></div>)
    const [inputName, setInputName] = useState('close')
    const [coords, setCoords] = useState([] as number[])
    // const [user, setUser] = useState({} as { name: string; email: string })
    const [marker, setMarker] = useState({} as any)
    const [isClickable, setIsClickable] = useState(false)
    const isClickableRef = useRef(false)
    isClickableRef.current = isClickable

    const locateMe = () => {
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

        navigator.geolocation.getCurrentPosition(success, error, options)
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
            const requestMarkers = await fetch(`/api/markers/get-markers`, {
                method: 'GET',
                headers: {},
                cache: 'no-store',
            })
            const updatedMarkers = await requestMarkers.json()

            map.getSource('vous-etes-gloopsy').setData({
                type: 'FeatureCollection',
                features: updatedMarkers,
            })
            setInputName('marker added')
        } else {
            setInputName('error')
        }
    }

    useEffect(() => {
        // check is user is logged in
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
                    setInputType(
                        <div className={style.inputTypeContainer}>
                            <div
                                className={buttonStyle.button}
                                onClick={function () {
                                    setInputName('localisation ongoing')
                                }}
                            >
                                <p>Utiliser ma position</p>
                            </div>
                            <div
                                className={buttonStyle.button}
                                onClick={function () {
                                    setInputName('manual localisation')
                                }}
                            >
                                <p>Placer manuellement</p>
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
                        <div
                            className={buttonStyle.button}
                            onClick={function () {
                                setInputName('add comment')
                            }}
                        >
                            <p>Valider position</p>
                        </div>
                    </div>
                )
                break

            case 'manual localisation':
                setIsClickable(true)
                map.getCanvas().style.cursor = 'pointer'

                setInputType(
                    <div className={style.inputTypeContainer}>
                        <p>Clique sur la map pour placer le pin!</p>
                        <button
                            className={buttonStyle.button}
                            onClick={function () {
                                setInputName('add comment')
                            }}
                        >
                            <p>Valider ton pin</p>
                        </button>
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
                            <p>Un petit commentaire et c'est tout bon 🙂</p>
                            <textarea
                                name="comment"
                                placeholder="Max 300 charactères"
                                maxLength={300}
                            ></textarea>

                            <button
                                type="submit"
                                className={buttonStyle.button}
                                onClick={function () {
                                    setInputName('loading')
                                }}
                            >
                                <p>Créer pin</p>
                            </button>
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
                <h6> Ajouter nouveau pin </h6>

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

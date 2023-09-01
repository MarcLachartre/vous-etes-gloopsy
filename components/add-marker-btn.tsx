'use client'
import buttonStyle from '../css/button.module.scss'
import style from '../css/add-marker.module.scss'

import mapboxgl from 'mapbox-gl'

import { getSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'

import { useContext } from 'react'
import { MapContext } from '@/context/map-context'

const addMarkerBtn = () => {
    const map = useContext(MapContext)

    const [isLoggedIn, setLoggedIn] = useState(false)
    const [inputType, setInputType] = useState(<div></div>)
    const [inputName, setInputName] = useState('close')
    const [coords, setCoords] = useState([] as number[])
    const [user, setUser] = useState({} as { name: string; email: string })
    const [temporaryMarker, setTemporaryMarker] = useState({} as any)

    const createMarker = (lng: number, lat: number, draggable: boolean) => {
        const el = document.createElement('div')
        el.className = 'marker'

        const marker = new mapboxgl.Marker(el, { draggable: draggable })
            .setLngLat([lng, lat])
            .addTo(map as any)
        return marker
    }

    const manualLocalisation = () => {
        map.on('click', function (e: any) {
            createMarker(e.lngLat.lng, e.lngLat.lat, false)
        })
    }

    const locateMe = () => {
        Object.keys(temporaryMarker).length !== 0
            ? temporaryMarker.remove()
            : false

        navigator.geolocation.getCurrentPosition((position) => {
            setInputName('add comment')
            map.flyTo({
                center: [position.coords.longitude, position.coords.latitude], // Fly to the selected target
                duration: 3000, // Animate over 12 seconds
                essential: true, // This animation is considered essential with
                zoom: 17,
            })
            const marker = createMarker(
                position.coords.longitude,
                position.coords.latitude,
                true
            )

            setTemporaryMarker(marker as any)

            setCoords([position.coords.longitude, position.coords.latitude])
        })
    }

    const onDragEnd = () => {
        const lngLat = temporaryMarker.getLngLat()
        setCoords([lngLat.lng, lngLat.lat])
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const formJson = Object.fromEntries(formData.entries())

        const response = await fetch('/api/markers/create-marker', {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    coord: coords,
                    userName: user.name,
                    userEmail: user.email,
                    comment: formJson.comment,
                },
            }),
            headers: {},
        })
        const markerData = await response.json()

        if (response.status === 200) {
            const el = document.createElement('div')
            el.className = 'marker'
            el.setAttribute('id', markerData._id)

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(
                    markerData.geoMarker.features[0].geometry.coordinates
                )
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3>${markerData.geoMarker.features[0].properties.owner}</h3>
                            <p>${markerData.geoMarker.features[0].properties.date} </p>
                            <p>${markerData.geoMarker.features[0].properties.time}</p>
                            <p>${markerData.geoMarker.features[0].properties.description}</p>`
                        )
                )
                .addTo(map as any)
            setInputName('marker added')
        } else {
            setInputName('error')
        }

        await temporaryMarker.remove()
    }

    useEffect(() => {
        // check is user is logged in
        const checkSession = async () => {
            if ((await getSession()) !== null) {
                const session: any = await getSession()
                setUser({ name: session.user.name, email: session.user.email })
                setLoggedIn(true)
            } else {
                setLoggedIn(false)
            }
        }
        checkSession()
    }, [])

    useEffect(() => {
        switch (inputName) {
            case 'close':
                Object.keys(temporaryMarker).length !== 0
                    ? temporaryMarker.remove()
                    : false
                setInputType(<div> </div>)

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
                                className={style.adrien}
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
                                    setCoords([])
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
                            className={style.adrien}
                        />
                    </div>
                )
                break
            case 'add comment':
                console.log(temporaryMarker.on('dragend', onDragEnd))
                setInputType(
                    <form
                        className={style.inputTypeContainer}
                        onSubmit={handleSubmit}
                    >
                        <p>
                            Vérifie la position du pin! Il est drag and
                            dropable. Allez, un petit commentaire et c'est tout
                            bon 🙂
                        </p>
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
                            <p>Valider ton pin</p>
                        </button>
                    </form>
                )
                break
            case 'loading':
                setInputType(
                    <div className={style.inputTypeContainer}>
                        <img
                            src="/adrien.png"
                            alt="adrien-wait"
                            className={style.adrien}
                        />
                    </div>
                )
                break
            case 'marker added':
                setInputType(
                    <div className={style.inputTypeContainer}>
                        <p>All good!</p>
                        <p> Eh merci mec! </p>
                    </div>
                )
                setTimeout(() => {
                    setInputName('close')
                }, 3000)
                break
            case 'manual localisation':
                manualLocalisation()
                console.log(1)
                setInputType(
                    <div className={style.inputTypeContainer}>
                        <p>Clique sur la map pour placer le pin!</p>
                        <button
                            className={buttonStyle.button}
                            onClick={function () {
                                setInputName('loading')
                            }}
                        >
                            <p>Valider ton pin</p>
                        </button>
                    </div>
                )

                break
            case 'error':
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
    }, [inputName, isLoggedIn, coords])

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

// map.on('click', function (e) {
//     var coordinates = e.lngLat
//     new mapboxgl.Popup()
//         .setLngLat(coordinates)
//         .setHTML('you clicked here: <br/>' + coordinates)
//         .addTo(map)
// })

export default addMarkerBtn

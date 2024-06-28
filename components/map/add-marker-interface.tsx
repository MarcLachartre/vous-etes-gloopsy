'use client'
import style from '../../css/map-page/add-marker.module.scss'
import mapboxgl from 'mapbox-gl'

import { useSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'
import { useContext } from 'react'

import { MarkersAmountStateContext } from '@/context/markers-amount-context'
import { MapContext } from '@/context/map-context'

import Button from '@mui/material/Button'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import AddLocationAltRoundedIcon from '@mui/icons-material/AddLocationAltRounded'

import AccessDeniedInterface from './add-marker-interface/access-denied-interface'
import StickingModeSelectionInterface from './add-marker-interface/sticking-mode-selection-interface'
import LoadingInterface from './add-marker-interface/loading-interface'
import AdjustLocationInterface from './add-marker-interface/adjust-location-interface'
import ManualLocalizationInterface from './add-marker-interface/manual-localization-interface'
import AddCommentInterface from './add-marker-interface/add-comment-interface'
import ThanksInterface from './add-marker-interface/thank-interface'
import ErrorInterface from './add-marker-interface/error-interface'
import SigninInterface from './add-marker-interface/signin-interface'

const addMarkerInterface = (props: any) => {
    const session = useSession()
    const user = session.data?.user

    const { markersAmount, setMarkersAmount } = useContext(
        MarkersAmountStateContext
    )
    const map = useContext(MapContext)

    const [interfaceWindow, setInterfaceWindow] = useState(<div></div>)
    const [interfaceName, setInterfaceName] = useState('close')
    const [coords, setCoords] = useState<number[]>([])
    const [marker, setMarker] = useState({} as any)
    const [isClickable, setIsClickable] = useState(false)
    const [crossDisplay, setCrossDisplay] = useState<string>('none')
    const isClickableRef = useRef(false)
    isClickableRef.current = isClickable

    const locateMe = async () => {
        const success = (position: any) => {
            setInterfaceName('validate location')

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
            setInterfaceName('error')
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

            setInterfaceName('marker added')
        } else {
            setInterfaceName('error')
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
        switch (interfaceName) {
            case 'close':
                Object.keys(marker).length !== 0 ? marker.remove() : false
                Object.keys(marker).length !== 0 ? setMarker({}) : false
                Object.keys(map).length !== 0
                    ? (map.getCanvas().style.cursor = '')
                    : false
                setCoords([])
                setIsClickable(false)
                setCrossDisplay('none')
                setInterfaceWindow(<div></div>)
                break

            case 'add marker selector':
                setCrossDisplay('flex')
                if (!user) {
                    setInterfaceWindow(<SigninInterface />)
                } else if (!!user && user.role !== 'MEMBER') {
                    setInterfaceWindow(<AccessDeniedInterface />)
                } else {
                    props.setShowAllMarkers(true)
                    setInterfaceWindow(
                        <StickingModeSelectionInterface
                            setInterfaceName={setInterfaceName}
                        />
                    )
                }
                break

            case 'localisation ongoing':
                locateMe()
                setCrossDisplay('none')
                setInterfaceWindow(<LoadingInterface />)
                break

            case 'validate location':
                setCrossDisplay('flex')
                setInterfaceWindow(
                    <AdjustLocationInterface
                        setInterfaceName={setInterfaceName}
                    />
                )
                break

            case 'manual localisation':
                setCrossDisplay('flex')
                setIsClickable(true)
                map.getCanvas().style.cursor = 'pointer'

                setInterfaceWindow(
                    <ManualLocalizationInterface
                        setInterfaceName={setInterfaceName}
                        setCoords={setCoords}
                    />
                )

                break

            case 'add comment':
                setCrossDisplay('flex')
                setIsClickable(false)
                map.getCanvas().style.cursor = ''
                if (coords.length === 0) {
                    setInterfaceName('manual localisation')
                } else {
                    setInterfaceWindow(
                        <AddCommentInterface
                            handleSubmit={handleSubmit}
                            setInterfaceName={setInterfaceName}
                        />
                    )
                }
                break

            case 'loading':
                setCrossDisplay('none')
                setInterfaceWindow(<LoadingInterface />)
                break

            case 'marker added':
                setCrossDisplay('flex')
                marker.remove()
                setMarker({})
                props.setShowAllMarkers(true)
                setInterfaceWindow(<ThanksInterface />)

                setTimeout(() => {
                    setInterfaceName('close')
                }, 3000)
                break

            case 'error':
                Object.keys(marker).length !== 0 ? marker.remove() : false
                Object.keys(marker).length !== 0 ? setMarker({}) : false
                setCoords([])
                setIsClickable(false)
                map.getCanvas().style.cursor = ''
                setInterfaceWindow(<ErrorInterface />)
                setTimeout(() => {
                    setInterfaceName('close')
                }, 3000)
        }
    }, [interfaceName, session])

    return (
        <>
            <div className={style.addMarkerContainer}>
                <Button
                    className={style.mobileAddMarkerButton}
                    onClick={() => {
                        setCrossDisplay('flex')
                        interfaceName === 'close'
                            ? setInterfaceName('add marker selector')
                            : setInterfaceName('close')
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
                        interfaceName === 'close'
                            ? setInterfaceName('add marker selector')
                            : setInterfaceName('close')
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
                                setInterfaceName('close')
                                setCrossDisplay('none')
                            }}
                            sx={{ fontSize: '16px' }}
                        />
                    </div>
                    {interfaceWindow}
                </div>
            </div>
        </>
    )
}

export default addMarkerInterface

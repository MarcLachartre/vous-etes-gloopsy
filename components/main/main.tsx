'use client'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useState } from 'react'

import Map from './map'
import Filters from './filters'
import AddMarkerBtn from './add-marker-btn'
import PrivacyPolicyLink from '../privacy-policy-link'
import { getSession } from 'next-auth/react'

import { MapContext } from '@/context/map-context'
import { MarkersDisplayedContext } from '@/context/markers-displayed-context'

import CustomLayout from '../custom-layout'
import type { GeoJson } from '@/custom-types'

const Main = (props: { initialMarkers: GeoJson[] }) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoibWFyY2xhY2hhcnRyZSIsImEiOiJjbGxjZzRqeGMwMTI2M2NsdzA4bXJodnFqIn0.rEH7luhuGuag_BVbVvw67g'

    const [map, setMap] = useState<any>({})
    const [GeolocateControl, setGeolocateControl] = useState<any>()

    const [user, setUser] = useState({})
    const [markersDisplayed, setMarkersDisplayed] = useState(
        props.initialMarkers
    )
    const [newUpdatedMarkers, setNewUpdatedMarkers] = useState(
        props.initialMarkers
    )
    const [showAllMarkers, setShowAllMarkers] = useState(true)

    const resetMarkers = async () => {
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

        return setNewUpdatedMarkers(await updatedMarkers)
    }

    useEffect(() => {
        setGeolocateControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
            })
        )
    }, [])

    useEffect(() => {
        const getUser = async () => {
            const user: any = await getSession()
            setUser(user)
        }

        getUser()
    }, [])

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [0.483776, 44.850782],
            zoom: 4,
        })

        setMap(map)
    }, [])

    useEffect(() => {
        const recentMarkers =
            newUpdatedMarkers !== undefined
                ? newUpdatedMarkers.slice(-10)
                : props.initialMarkers.slice(-10)

        if (showAllMarkers) {
            newUpdatedMarkers !== undefined
                ? setMarkersDisplayed(newUpdatedMarkers)
                : setMarkersDisplayed(props.initialMarkers)
        } else {
            setMarkersDisplayed(recentMarkers)
        }
    }, [showAllMarkers])

    return (
        <MarkersDisplayedContext.Provider value={markersDisplayed}>
            <MapContext.Provider value={map}>
                <CustomLayout count={props.initialMarkers.length}>
                    <Map
                        key={'Map'}
                        user={user}
                        setShowAllMarkers={setShowAllMarkers}
                        resetMarkers={resetMarkers}
                        GeolocateControl={GeolocateControl}
                    />
                    <Filters // Button that shows the last 10 markers pined on the map
                        key={'ShowRecentMarkers'}
                        showAllMarkers={showAllMarkers}
                        setShowAllMarkers={setShowAllMarkers}
                    />
                    <AddMarkerBtn
                        key={'AddMarkerBtn'}
                        user={user}
                        setShowAllMarkers={setShowAllMarkers}
                        resetMarkers={resetMarkers}
                        GeolocateControl={GeolocateControl}
                        setGeolocateControl={setGeolocateControl}
                    />
                    <PrivacyPolicyLink key={'PrivacyPolicyLink'} />
                </CustomLayout>
            </MapContext.Provider>
        </MarkersDisplayedContext.Provider>
    )
}

export default Main

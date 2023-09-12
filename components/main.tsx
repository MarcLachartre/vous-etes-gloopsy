'use client'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useState, useCallback } from 'react'

import Map from '../components/map'
import AuthLink from '../components/auth/auth-link'
import AddMarkerBtn from '../components/add-marker-btn'
import PrivacyPolicyLink from '../components/privacy-policy-link'
import { getSession } from 'next-auth/react'

import { MapContext } from '@/context/map-context'
import { InitialMarkersContext } from '@/context/initial-markers-context'

const Main = (props: any) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoibWFyY2xhY2hhcnRyZSIsImEiOiJjbGxjZzRqeGMwMTI2M2NsdzA4bXJodnFqIn0.rEH7luhuGuag_BVbVvw67g'

    const [map, setMap] = useState({} as any)
    const [user, setUser] = useState({})

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
            zoom: 5,
        })

        setMap(map)
    }, [])

    return (
        <InitialMarkersContext.Provider value={props.initialMarkers}>
            <MapContext.Provider value={map}>
                {[
                    <Map key={'map'} user={user} />,
                    <AuthLink key={'authlink'} />,
                    <AddMarkerBtn key={'AddMarkerBtn'} />,
                    <PrivacyPolicyLink key={'PrivacyPolicyLink'} />,
                ]}
            </MapContext.Provider>
        </InitialMarkersContext.Provider>
    )
}

export default Main

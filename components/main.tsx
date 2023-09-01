'use client'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useState } from 'react'

import Map from '../components/map'
import AuthLink from '../components/auth/auth-link'
import AddMarkerBtn from '../components/add-marker-btn'

import { MapContext } from '@/context/map-context'

const Main = (props: any) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoibWFyY2xhY2hhcnRyZSIsImEiOiJjbGxjZzRqeGMwMTI2M2NsdzA4bXJodnFqIn0.rEH7luhuGuag_BVbVvw67g'

    const [map, setMap] = useState({})
    useEffect(() => {
        setMap(
            new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/outdoors-v12',
                center: [0.483776, 44.850782],
                zoom: 5,
            })
        )
    }, [])

    return (
        <MapContext.Provider value={map as any}>
            {[
                <Map key={'map'} />,
                <AuthLink key={'authlink'} />,
                <AddMarkerBtn key={'AddMarkerBtn'} />,
            ]}
        </MapContext.Provider>
    )
}

export default Main

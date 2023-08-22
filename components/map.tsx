'use client'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import React, { useEffect } from 'react'

interface Geojson {
    features: Array<{
        type: string
        geometry: {
            type: string
            coordinates: [number, number]
        }
        properties: {
            owner: string
            description: string
        }
    }>
}

const Map = (props: any) => {
    useEffect(() => {
        mapboxgl.accessToken =
            'pk.eyJ1IjoibWFyY2xhY2hhcnRyZSIsImEiOiJjbGxjZzRqeGMwMTI2M2NsdzA4bXJodnFqIn0.rEH7luhuGuag_BVbVvw67g'

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [0.483776, 44.850782],
            zoom: 5,
        })

        props.initialMarkers.forEach((marker: any) => {
            // create a HTML element for each feature
            const el = document.createElement('div')
            el.className = 'marker'
            el.setAttribute('id', marker._id)

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.features[0].geometry.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3>${marker.features[0].properties.owner}</h3>
                            <p>${marker.features[0].properties.description}</p>`
                        )
                )
                .addTo(map)
        })
    }, [])

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <div
                id="map"
                className="mapboxgl-map"
                style={{ position: 'relative', width: '100%', height: '100%' }}
            ></div>
        </div>
    )
}

export default Map

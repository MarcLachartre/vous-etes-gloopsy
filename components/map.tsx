'use client'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import React, { useEffect, useState } from 'react'

import { useContext } from 'react'
import { MapContext } from '../context/map-context'
// import getMarkers from '../database/markers/get-markers'
// interface Geojson {
//     initialMarkers: {
//         features: Array<{
//             type: string
//             geometry: {
//                 type: string
//                 coordinates: [number, number]
//             }
//             properties: {
//                 owner: string
//                 description: string
//                 date: string
//                 time: string
//             }
//         }>
//     }
// }

const Map = (props: any) => {
    const map = useContext(MapContext)

    useEffect(() => {
        const getMarkers = async () => {
            const requestMarkers = await fetch('/api/markers/get-markers', {
                method: 'GET',
                headers: {},
                cache: 'no-store',
            })
            const initialMarkers = await requestMarkers.json()
            console.log(initialMarkers)
            if (Object.keys(map).length !== 0) {
                initialMarkers.forEach((marker: any) => {
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
                                    <p>${marker.features[0].properties.date} </p>
                                    <p>${marker.features[0].properties.time}</p>
                                    <p>${marker.features[0].properties.description}</p>`
                                )
                        )
                        .addTo(map as any)
                })
            }
        }

        getMarkers()
        // const sw = new mapboxgl.LngLat(-73.9876, 40.7661)
    })

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <div
                id="map"
                className="mapboxgl-map"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}
            ></div>
        </div>
    )
}

export default Map

'use client'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import React, { useEffect, useState } from 'react'

import { useContext } from 'react'
import { MapContext } from '../context/map-context'
import getMarkers from '../database/markers/get-markers'
interface Geojson {
    initialMarkers: {
        features: Array<{
            type: string
            geometry: {
                type: string
                coordinates: [number, number]
            }
            properties: {
                owner: string
                description: string
                date: string
                time: string
            }
        }>
    }
}

const Map = (props: any) => {
    const map = useContext(MapContext)

    useEffect(() => {
        if (Object.keys(map).length !== 0) {
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
                            <p>${marker.features[0].properties.date} </p>
                            <p>${marker.features[0].properties.time}</p>
                            <p>${marker.features[0].properties.description}</p>`
                            )
                    )
                    .addTo(map as any)
            })
        }
        const sw = new mapboxgl.LngLat(-73.9876, 40.7661)
        // map.addControl(
        //     new mapboxgl.GeolocateControl({
        //         positionOptions: {
        //             enableHighAccuracy: true,
        //         },
        //         // When active the map will receive updates to the device's location as it changes.
        //         trackUserLocation: true,
        //         // Draw an arrow next to the location dot to indicate which direction the device is heading.
        //         showUserHeading: true,
        //     })
        // )

        // const geolocate = new mapboxgl.GeolocateControl({
        //     positionOptions: {
        //         enableHighAccuracy: true,
        //     },
        //     trackUserLocation: true,
        // })
        // Add the control to the map.
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

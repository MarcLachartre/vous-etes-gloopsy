'use client'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import popupStyle from '../css/popup.module.scss'

import DeleteMarker from './delete-marker'

import React, { useEffect, useState, useRef, useContext } from 'react'

import { MapContext } from '../context/map-context'
import { InitialMarkersContext } from '../context/initial-markers-context'

const Map = (props: any) => {
    const map = useContext(MapContext)
    const initialMarkers = useContext(InitialMarkersContext)

    const isMounted = useRef(false)

    const [showDeleteBox, setShowDeleteBox] = useState(false)

    const [popUp, setPopUp] = useState(
        new mapboxgl.Popup({
            closeOnClick: true,
            closeOnMove: true,
        })
    )
    const [popUpContent, setPopUpContent] = useState({
        owner: '',
        description: '',
        date: '',
        time: '',
        email: '',
        markerId: '',
    })

    useEffect(() => {
        if (Object.keys(map).length !== 0) {
            map.on('load', async () => {
                map.addSource('vous-etes-gloopsy', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: initialMarkers,
                    },
                    cluster: true,
                    clusterMaxZoom: 15, // Max zoom to cluster points on
                    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
                })

                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'vous-etes-gloopsy',
                    filter: ['has', 'point_count'],
                    paint: {
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            'white',
                            50,
                            'white',
                            200,
                            'white',
                        ],

                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            50,
                            30,
                            200,
                            40,
                        ],
                    },
                })

                map.loadImage('/image-empty.png', (error: any, image: any) => {
                    if (error) throw error

                    map.addImage('image-empty', image as any)

                    map.addLayer({
                        id: 'cluster-count',
                        type: 'symbol',
                        source: 'vous-etes-gloopsy',
                        filter: ['has', 'point_count'],
                        layout: {
                            'icon-image': 'image-empty',
                            'icon-size': [
                                'step',
                                ['get', 'point_count'],
                                0.1,
                                50,
                                0.1449,
                                200,
                                0.19,
                            ],
                            'text-field': ['get', 'point_count_abbreviated'],
                            'text-font': [
                                'DIN Offc Pro Medium',
                                'Arial Unicode MS Bold',
                            ],
                            'text-size': 13,
                        },
                    })
                })

                map.loadImage('/image.png', (error: any, image: any) => {
                    if (error) throw error
                    // Add the loaded image to the style's sprite with the ID 'kitten'.
                    map.addImage('image', image as any)

                    map.addLayer({
                        id: 'unclustered-point',
                        type: 'symbol',
                        source: 'vous-etes-gloopsy',
                        filter: ['!', ['has', 'point_count']],
                        layout: {
                            'icon-image': 'image', // reference the image
                            'icon-size': 0.07,
                        },
                    })
                })

                map.on('click', 'unclustered-point', (e: any) => {
                    const coordinates =
                        e.features[0].geometry.coordinates.slice()

                    const owner = e.features[0].properties.owner
                    const email = e.features[0].properties.email
                    const description = e.features[0].properties.description
                    const date = e.features[0].properties.date
                    const time = e.features[0].properties.time
                    const markerId = e.features[0].properties.id

                    setPopUpContent({
                        owner: owner,
                        description: description,
                        date: date,
                        time: time,
                        email: email,
                        markerId: markerId,
                    })
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] +=
                            e.lngLat.lng > coordinates[0] ? 360 : -360
                    }
                    const popUp = new mapboxgl.Popup({
                        closeOnClick: true,
                        closeOnMove: true,
                    })
                        .setLngLat(coordinates)
                        .setHTML(
                            `
                        <div class=${popupStyle.popUpContainer}>
                            <h4>${popUpContent.owner}</h4>
                            <div class= ${popupStyle.description}>
                                <p>${popUpContent.description}</p>
                            </div>
                            <p class="small-text"> Posté le ${popUpContent.date} à ${popUpContent.time}</p>
                        </div>
                    `
                        )
                        .addTo(map)
                    setPopUp(popUp)
                })

                map.on('mouseenter', 'unclustered-point', () => {
                    map.getCanvas().style.cursor = 'pointer'
                })

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'unclustered-point', () => {
                    map.getCanvas().style.cursor = ''
                })
            })
        }
    }, [map])

    useEffect(() => {
        const defaultPopUpHTML = `
        
        <div>
            <h4>${popUpContent.owner}</h4>
            <p class="small-text"> Posté le ${popUpContent.date} à ${popUpContent.time}</p>
        </div>
        <p>${popUpContent.description}</p>
        
    `

        const displayDeleteLink = () => {
            const divElement = document.createElement('div')
            divElement.classList.add(`${popupStyle.popUpContainer}`)
            const link = document.createElement('a')
            link.style.alignSelf = 'center'
            link.style.cursor = 'pointer'

            link.innerHTML = 'Supprimer'
            divElement.innerHTML = defaultPopUpHTML
            divElement.appendChild(link)

            link.addEventListener('click', (e) => {
                setShowDeleteBox(true)
                popUp.remove()
            })

            return divElement
        }

        if (isMounted.current === true && props.user !== null) {
            // Prevent the following to be executed on first render

            if (
                Object.keys(props.user).length !== 0 &&
                props.user.user.email === popUpContent.email
            ) {
                popUp.setDOMContent(displayDeleteLink())
            } else {
                popUp.setHTML(
                    ` <div class="${popupStyle.popUpContainer}">${defaultPopUpHTML}</div>`
                )
            }
        } else if (isMounted.current === true) {
            popUp.setHTML(
                ` <div class="${popupStyle.popUpContainer}">${defaultPopUpHTML}</div>`
            )
        }

        isMounted.current = true
    }, [popUp])

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            {showDeleteBox === true ? (
                <DeleteMarker
                    markerId={popUpContent.markerId}
                    setShowDeleteBox={setShowDeleteBox}
                />
            ) : null}

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

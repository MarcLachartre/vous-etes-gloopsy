'use client'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import popupStyle from '../../css/popup.module.scss'

import EditMarkerBox from './edit-marker-box'

import React, {
    useEffect,
    useState,
    useRef,
    useContext,
    Dispatch,
    SetStateAction,
} from 'react'

import { MapContext } from '../../context/map-context'
import { MarkersDisplayedContext } from '../../context/markers-displayed-context'
import DeleteMarkerBox from './delete-marker-box'

const Map = (props: {
    key: string
    user: any
    setShowAllMarkers: Dispatch<SetStateAction<boolean>>
    resetMarkers: Function
    GeolocateControl: any
}) => {
    const map = useContext(MapContext)
    const markersDisplayed = useContext(MarkersDisplayedContext)
    const isMounted = useRef(false)

    const [showDeleteBox, setShowDeleteBox] = useState(false)
    const [showEditBox, setShowEditBox] = useState<boolean>(false)

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
        timestamp: '',
        picturePublicId: '',
        pictureURL: '',
        markerId: '',
    })

    useEffect(() => {
        if (Object.keys(map).length !== 0) {
            map.getSource('vous-etes-gloopsy').setData({
                // Update map when the user modifies the marker he wants to see (for example last 10 markers)
                type: 'FeatureCollection',
                features: markersDisplayed,
            })
        }
    }, [markersDisplayed])

    useEffect(() => {
        if (Object.keys(map).length !== 0) {
            map.on('load', async () => {
                map.addSource('vous-etes-gloopsy', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: markersDisplayed,
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
                        'circle-opacity': 0.4,
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            16,
                            50,
                            20,
                            200,
                            24,
                        ],
                    },
                })

                map.on('click', 'clusters', (e: any) => {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: ['clusters'],
                    })
                    const clusterId = features[0].properties.cluster_id
                    map.getSource('vous-etes-gloopsy').getClusterExpansionZoom(
                        clusterId,
                        (err: any, zoom: any) => {
                            if (err) return

                            map.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom * 1.1,
                            })
                        }
                    )
                })

                map.loadImage(
                    '/empty-image-no-border.png',
                    (error: any, image: any) => {
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
                                    0.09,
                                    50,
                                    0.1,
                                    200,
                                    0.12,
                                ],
                                'text-field': [
                                    'get',
                                    'point_count_abbreviated',
                                ],
                                'text-font': [
                                    'DIN Offc Pro Medium',
                                    'Arial Unicode MS Bold',
                                ],
                                'text-size': 14,
                            },
                        })
                    }
                )

                map.loadImage(
                    '/marker-no-border.png',
                    (error: any, image: any) => {
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
                    }
                )

                map.on('click', 'unclustered-point', (e: any) => {
                    const coordinates =
                        e.features[0].geometry.coordinates.slice()
                    const owner = JSON.parse(e.features[0].properties.user)[0]
                        .username
                    const email = e.features[0].properties.email
                    const description = e.features[0].properties.description
                    const date = e.features[0].properties.date
                    const time = e.features[0].properties.time
                    const timestamp = e.features[0].properties.timestamp
                    const picturePublicId =
                        e.features[0].properties.picturePublicId
                    const pictureURL = e.features[0].properties.pictureURL
                    const markerId = e.features[0].properties.id

                    setPopUpContent({
                        owner: owner,
                        description: description,
                        date: date,
                        time: time,
                        email: email,
                        picturePublicId: picturePublicId,
                        timestamp: timestamp,
                        pictureURL: pictureURL,
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

                map.addControl(props.GeolocateControl)

                map.on('mouseenter', 'unclustered-point', () => {
                    map.getCanvas().style.cursor = 'pointer'
                })

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'unclustered-point', () => {
                    map.getCanvas().style.cursor = ''
                })

                map.on('mouseenter', 'clusters', () => {
                    map.getCanvas().style.cursor = 'pointer'
                })

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'clusters', () => {
                    map.getCanvas().style.cursor = ''
                })
            })
        }
    }, [map, props.GeolocateControl])

    useEffect(() => {
        const defaultPopUpHTML = `
        <div>
            <h5>${popUpContent.owner}</h5>   
            <p class="small-text"> Posté le ${new Date(
                popUpContent.timestamp
            ).toLocaleString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })} à ${new Date(popUpContent.timestamp).toLocaleTimeString(
            'fr-FR',
            { timeZoneName: 'short' }
        )}
            
            </p>   
        </div>
        <p>${popUpContent.description}</p>
        ${
            popUpContent.pictureURL !== undefined
                ? `<img src=${popUpContent.pictureURL} />`
                : ''
        }
    `

        const displayDeleteLink = () => {
            const divElement = document.createElement('div')
            const linkContainer = document.createElement('div')

            divElement.classList.add(`${popupStyle.popUpContainer}`)

            const deleteLink = document.createElement('a')
            const editLink = document.createElement('a')
            const linkSeparation = document.createElement('div')

            linkContainer.style.display = 'flex'
            linkContainer.style.alignSelf = 'center'

            deleteLink.style.cursor = 'pointer'
            editLink.style.cursor = 'pointer'

            divElement.innerHTML = defaultPopUpHTML
            deleteLink.innerHTML = 'Supprimer'
            editLink.innerHTML = 'Editer'
            linkSeparation.innerHTML = '&nbsp | &nbsp'

            linkContainer.appendChild(editLink)
            linkContainer.appendChild(linkSeparation)
            linkContainer.appendChild(deleteLink)
            divElement.appendChild(linkContainer)

            deleteLink.addEventListener('click', (e) => {
                setShowDeleteBox(true)
                popUp.remove()
            })

            editLink.addEventListener('click', (e) => {
                setShowEditBox(true)
                popUp.remove()
            })

            return divElement
        }

        if (isMounted.current === true && props.user !== null) {
            // Prevent the following to be executed on first render

            if (props.user && props.user.email === popUpContent.email) {
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
        <div style={{ height: '100%', width: '100vw', position: 'relative' }}>
            {showDeleteBox === true ? (
                <DeleteMarkerBox
                    markerId={popUpContent.markerId}
                    setShowDeleteBox={setShowDeleteBox}
                    setShowAllMarkers={props.setShowAllMarkers}
                    // setMarkersUpdated={props.setMarkersUpdated}
                    picturePublicId={popUpContent.picturePublicId}
                    resetMarkers={props.resetMarkers}
                />
            ) : null}

            {showEditBox === true ? (
                <EditMarkerBox
                    markerId={popUpContent.markerId}
                    comment={popUpContent.description}
                    pictureURL={popUpContent.pictureURL}
                    picturePublicId={popUpContent.picturePublicId}
                    setShowAllMarkers={props.setShowAllMarkers}
                    setShowEditBox={setShowEditBox}
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

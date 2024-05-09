'use client'

import styles from '../../css/main-page/show-recent-markers.module.scss'

import { type Dispatch } from 'react'

const ShowRecentMarkers = ({
    showAllMarkers,
    setShowAllMarkers,
}: {
    showAllMarkers: boolean
    setShowAllMarkers: Dispatch<boolean>
}) => {
    return (
        <div
            className={styles.recentMarkersContainer}
            onClick={() => {
                showAllMarkers
                    ? setShowAllMarkers(false)
                    : setShowAllMarkers(true)
            }}
        >
            {showAllMarkers ? <p>show recent</p> : <p>show all</p>}
        </div>
    )
}

export default ShowRecentMarkers

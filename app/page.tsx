import styles from './page.module.css'

import Map from '../components/map'
import getMarkers from '../database/get-markers'
// import addMarkers from '../database/add-markers'
// import editMarker from '../database/edit-marker'
// import deleteMarker from '../database/delete-marker'

export default async function Home() {
    const initialGeojsons = await getMarkers()
    const initialMarkers = JSON.parse(initialGeojsons)
    return (
        <main className={styles.main}>
            <Map initialMarkers={initialMarkers} />
        </main>
    )
}

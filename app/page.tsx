import styles from './page.module.css'

import Main from '../components/main'
export const dynamic = 'force-dynamic'
// 'auto' | 'force-dynamic'
import createMarker from '../database/markers/create-marker'
// import editMarker from '../database/edit-marker'
// import deleteMarker from '../database/delete-marker'

import getMarkers from '../database/markers/get-markers'
export default async function Home() {
    // const initialGeojsons = await getMarkers()
    // const initialMarkers = JSON.parse(initialGeojsons)
    // createMarker([0.5, 45], 'Hubert', 'wouf')
    return (
        <main className={styles.main}>
            <Main />
        </main>
    )
}

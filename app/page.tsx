import styles from './page.module.css'
import Main from '../components/main/main'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const requestMarkers = await fetch(
        `${process.env.DOMAIN}/api/markers/get-markers`,
        {
            method: 'GET',
            headers: {},
            cache: 'no-store',
        }
    )
    const initialMarkers = await requestMarkers.json()

    return (
        <main className={styles.main}>
            <Main initialMarkers={initialMarkers} />
        </main>
    )
}

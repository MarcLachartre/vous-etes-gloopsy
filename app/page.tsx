import styles from './page.module.css'
import Main from '../components/main/main'
import Head from 'next/head'

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
            <Head>
                <meta property="og:title" content="Vous êtes Gloopsy" />
                <meta property="og:description" content="Stick it everywhere" />
                <meta property="og:image" content="/image.jpg" />
            </Head>
            <Main initialMarkers={initialMarkers} />
        </main>
    )
}

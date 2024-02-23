import BadgesPage from '@/components/badges/badges-page'
import Head from 'next/head'

export default async function Badges() {
    const requestMarkers = await fetch(
        `${process.env.DOMAIN}/api/markers/get-markers`,
        {
            method: 'GET',
            headers: {},
            cache: 'no-store',
        }
    )
    const initialMarkers = await requestMarkers.json()

    return [
        <Head>
            <meta property="og:title" content="Vous êtes Gloopsy" />
            <meta property="og:description" content="Stick it everywhere" />
            <meta property="og:image" content="./image.jpg" />
        </Head>,
        <main className={'page-container'}>
            <BadgesPage initialMarkersLength={initialMarkers.length} />
        </main>,
    ]
}

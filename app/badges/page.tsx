import BadgesPage from '@/components/badges/badges-page'

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

    return (
        <main className={'page-container'}>
            <BadgesPage initialMarkersLength={initialMarkers.length} />
        </main>
    )
}

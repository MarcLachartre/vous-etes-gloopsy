import { auth } from '../../auth'
import BadgesPage from '@/components/badges/badges-page'
import { useSession } from 'next-auth/react'

export default async function Badges() {
    const session = await auth()
    if (!session) return <h2>Not authenticated</h2>
    if (session.user.role !== 'MEMBER') return <h2>Not authorized</h2>

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

import styles from './page.module.css'
import Main from '../../components/main/main'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const h = headers()

    const getMarkers = async () => {
        const request = new NextRequest(
            `${process.env.DOMAIN}/api/markers/get-markers`
        )

        const requestMarkers = await fetch(request, {
            method: 'GET',
            headers: new Headers(h),

            cache: 'no-store',
        })

        return await requestMarkers.json()
    }

    const createMarker = async (formData: FormData) => {
        'use server'

        const request = new NextRequest(
            `${process.env.DOMAIN}api/markers/create-marker`
        )

        const response = await fetch(request, {
            method: 'POST',
            body: formData,
            headers: new Headers(h),
        })
        const res = { status: response.status }
        return res
    }

    const editMarker = async (formData: FormData) => {
        'use server'
        console.log(12)
        const request = new NextRequest(
            `${process.env.DOMAIN}api/markers/create-marker`
        )

        const response = await fetch('/api/markers/edit-marker', {
            method: 'PATCH',
            body: formData,
            headers: h,
        })

        const res = { status: response.status }
        return res
    }

    const initialMarkers = await getMarkers()

    return (
        <main className={styles.main}>
            <Main
                initialMarkers={initialMarkers}
                createMarker={createMarker}
                editMarker={editMarker}
                // deleteMarker={createMarker}
            />
        </main>
    )
}

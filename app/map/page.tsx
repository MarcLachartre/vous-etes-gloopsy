import styles from '@/css/map-page/map-page.module.scss'
import Main from '../../components/map/map-page'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Page() {
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

        const request = new NextRequest(
            `${process.env.DOMAIN}api/markers/edit-marker`
        )

        const response = await fetch(request, {
            method: 'PATCH',
            body: formData,
            headers: h,
        })
        const markers = (await response.json()).markers
        const res = { status: response.status, markers: markers }
        return res
    }

    const deleteMarker = async (formData: FormData) => {
        'use server'

        const request = new NextRequest(
            `${process.env.DOMAIN}api/markers/delete-marker`
        )

        const response = await fetch(request, {
            method: 'DELETE',
            body: formData,
            headers: h,
        })

        const markers = (await response.json()).markers
        const res = { status: response.status, markers: markers }
        return res
    }

    const initialMarkers = await getMarkers()

    return (
        <main className={styles.main}>
            <Main
                initialMarkers={initialMarkers}
                createMarker={createMarker}
                editMarker={editMarker}
                deleteMarker={deleteMarker}
            />
        </main>
    )
}

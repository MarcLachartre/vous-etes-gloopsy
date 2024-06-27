'use server'
import HomePage from '@/components/home/home-page'
import { headers } from 'next/headers'
import style from './page.module.css'

export default async function Page() {
    const request = `${process.env.DOMAIN}/api/users/get-usernames`
    const options = { headers: new Headers(headers()) }
    const res = await fetch(request, options)
    const processedRes = await res.json()

    const usernames = processedRes.map(({ username }: { username: string }) => {
        return 'Vous êtes <br />' + username
    })
    usernames.splice(0, 0, 'Vous êtes <br />Gloopsy')
    usernames.push('Vous êtes <br />Binbin')

    return (
        <div className="page-container">
            <HomePage usernames={usernames} />
        </div>
    )
}

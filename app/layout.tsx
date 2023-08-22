import './globals.css'
import type { Metadata } from 'next'
import Provider from '../provider'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Gloopsy tracker',
    description: 'Vous êtes gloopsy',
    icons: {
        icon: '/image.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Provider>{children}</Provider>
            </body>
        </html>
    )
}

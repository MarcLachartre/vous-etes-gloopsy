import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Menu from '@/components/layout/menu'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Gloopsy tracker',
    description: 'Vous êtes gloopsy',
    icons: {
        icon: '/image.png',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1.0,
    },
    openGraph: {
        title: 'Vous êtes Gloopsy',
        description: 'Gloopsy tracker',
        images: '/image.png',
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
                <Menu />
                {children}
            </body>
        </html>
    )
}

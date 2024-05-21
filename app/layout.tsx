import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Menu from '@/components/layout/menu'
const inter = Inter({ subsets: ['latin'] })
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme.ts'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

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
    metadataBase: new URL(
        'https://vous-etes-gloopsy-6e09e17d7d15.herokuapp.com/'
    ),
}

export default function RootLayout({
    children,
}: // pageProps: { session, ...pageProps },
{
    children: React.ReactNode
    // pageProps: { session: Session; pageProps: any }
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider theme={theme}>
                    {/* <SessionProvider session={session} refetchInterval={5 * 60}> */}
                    <Menu />
                    {children}
                    {/* </SessionProvider> */}
                </ThemeProvider>
            </body>
        </html>
    )
}

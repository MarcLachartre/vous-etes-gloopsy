'use client'
import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const theme = createTheme({
    palette: {
        primary: {
            main: '#6a6a6a',
            // light: '#42a5f5',
            // dark: '#1565c0',
            contrastText: '#fff',
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        htmlFontSize: 10,
    },
})

export default theme

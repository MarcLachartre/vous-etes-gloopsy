'use client'

import { createContext } from 'react'

const MapContext = createContext({
    flyTo: function () {
        return
    },
} as any)

export { MapContext }

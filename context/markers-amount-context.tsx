import { createContext } from 'react'

interface MarkersAmountStateContext {
    markersAmount: number
    setMarkersAmount: (newState: number) => void
}

const MarkersAmountStateContext = createContext<MarkersAmountStateContext>({
    markersAmount: 0,
    setMarkersAmount: () => undefined,
})

export { MarkersAmountStateContext }

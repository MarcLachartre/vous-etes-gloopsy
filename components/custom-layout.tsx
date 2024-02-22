'use client'
import { MarkersAmountStateContext } from '@/context/markers-amount-context'
import { ReactNode, useEffect, useState } from 'react'

const CustomLayout = ({
    children,
    count,
}: {
    children: ReactNode
    count?: number
}) => {
    const [markersAmount, setMarkersAmount] = useState<number>(0)

    useEffect(() => {
        count !== undefined ? setMarkersAmount(count) : false
    }, [])

    return (
        <MarkersAmountStateContext.Provider
            value={{ markersAmount, setMarkersAmount }}
        >
            {children}
        </MarkersAmountStateContext.Provider>
    )
}

export default CustomLayout

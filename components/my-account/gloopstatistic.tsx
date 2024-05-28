'use client'
import styles from '../../css/my-account-page/gloopstatistic.module.scss'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { useEffect, useState } from 'react'

import { StickersCount } from './gloopstatistic/stickers-count'
import { MonthlyCount } from './gloopstatistic/monthly-count'
import { YearlyCount } from './gloopstatistic/yearly-count'
import { GraphCount } from './gloopstatistic/graph-count'

const Gloopstatistics = ({
    globalData,
    personalData,
}: {
    globalData:
        | {
              twelveMonthsCount: number[]
              allTimeCount: number
              yearlyCount: number
              monthlyCount: number
          }
        | undefined
    personalData:
        | {
              twelveMonthsCount: number[]
              allTimeCount: number
              yearlyCount: number
              monthlyCount: number
          }
        | undefined
}) => {
    const [alignment, setAlignment] = useState<string>('La Gloopstat')

    const [displayedData, setDisplayedData] = useState<{
        allTimeCount: number
        yearlyCount: number
        monthlyCount: number
        twelveMonthsCount: number[]
    }>()

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ) => {
        newAlignment ? setAlignment(newAlignment) : false
    }

    useEffect(() => {
        if (globalData !== undefined && alignment === 'La Gloopstat') {
            setDisplayedData(globalData)
        } else if (personalData !== undefined && alignment === 'Mes Stats') {
            setDisplayedData(personalData)
        }
    }, [globalData, personalData])

    useEffect(() => {
        alignment === 'Mes Stats'
            ? setDisplayedData(personalData)
            : setDisplayedData(globalData)
    }, [alignment])

    return (
        <div className={styles.statsContainer}>
            <div className={styles.statSelector}>
                <ToggleButtonGroup
                    color="error"
                    size="large"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    style={{
                        borderRadius: 'var(--border-radius)',
                        backgroundColor: 'white',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <ToggleButton
                        value="La Gloopstat"
                        style={{
                            borderBottomLeftRadius: 'var(--border-radius)',
                            borderTopLeftRadius: 'var(--border-radius)',
                            width: '100%',
                            border: 'none',
                        }}
                        sx={{
                            '&.MuiToggleButton-root': {
                                color: 'var(--default-blue)',
                            },
                            '&.MuiToggleButton-root:hover': {
                                backgroundColor: 'rgba(242, 102, 89, 0.15)',
                                color: 'rgba(242, 102, 89, 0.90)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(242, 102, 89, 0.95)',
                                color: '#F0EFF4',
                            },
                            '&.Mui-selected:hover': {
                                backgroundColor: '#F26659',
                                color: '#F0EFF4',
                            },
                        }}
                    >
                        La Gloopstat
                    </ToggleButton>
                    <ToggleButton
                        value="Mes Stats"
                        style={{
                            borderBottomRightRadius: 'var(--border-radius)',
                            borderTopRightRadius: 'var(--border-radius)',
                            width: '100%',
                            border: 'none',
                        }}
                        sx={{
                            '&.MuiToggleButton-root': {
                                color: 'var(--default-blue)',
                            },
                            '&.MuiToggleButton-root:hover': {
                                backgroundColor: 'rgba(242, 102, 89, 0.15)',
                                color: 'rgba(242, 102, 89, 0.90)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(242, 102, 89, 0.95)',
                                color: '#F0EFF4',
                            },
                            '&.Mui-selected:hover': {
                                backgroundColor: '#F26659',
                                color: '#F0EFF4',
                            },
                        }}
                    >
                        Mes Stats
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className={styles.dataGridContainer}>
                <StickersCount allTimeCount={displayedData?.allTimeCount} />
                <YearlyCount yearlyCount={displayedData?.yearlyCount} />
                <MonthlyCount monthlyCount={displayedData?.monthlyCount} />
            </div>
            <GraphCount twelveMonthsCount={displayedData?.twelveMonthsCount} />
        </div>
    )
}

export { Gloopstatistics }

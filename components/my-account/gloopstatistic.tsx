'use client'
import styles from 'css/my-account-page/gloopstatistic.module.scss'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import ModeNightIcon from '@mui/icons-material/ModeNight'
import { useEffect, useState } from 'react'
import { LineChart } from '@mui/x-charts/LineChart'
import { StickersAmount } from './gloopstatistic/stickers-amount'
import type { GeoJson } from '@/custom-types'
import { StickersAverage } from './gloopstatistic/stickers-average'

const Gloopstatistics = ({
    getStickers,
}: {
    getStickers: (request?: { userEmail: string }) => Promise<number>
    // getStickers: (arg: string) => { stickers: GeoJson[] }
}) => {
    const [alignment, setAlignment] = useState('La Gloopstat')
    const [stickersCount, setStickersCount] = useState<number>()

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ) => {
        newAlignment ? setAlignment(newAlignment) : false
    }

    useEffect(() => {
        getStickers().then((r: number) => {
            setStickersCount(r)
        })
    }, [])

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
                        backgroundColor: 'white',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <ToggleButton
                        onClick={async () => {
                            await getStickers({ userEmail: 'a' })
                        }}
                        value="La Gloopstat"
                        style={{
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
                        onClick={async () => {
                            getStickers({ userEmail: 'b' })
                        }}
                        value="Mes Stats"
                        style={{
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
                <StickersAmount amount={stickersCount} />
                <StickersAverage />
                <Box
                    className={styles.dataContainer}
                    bgcolor={'white'}
                    sx={{
                        borderRadius: 1,
                    }}
                >
                    <p className={styles.dataTitle}>Implantation</p>
                    <div className={styles.dataValue}>
                        <h2>🇫🇷🇮🇹🇧🇪🇫🇷🇮🇹🇧🇪🇫🇷🇮🇹🇧🇪🇫🇷🇮🇹🇧🇪🇫🇷🇮🇹🇧🇪</h2>
                    </div>
                </Box>
            </div>
            <Box
                className={styles.chartContainer}
                sx={{
                    borderRadius: 1,
                }}
            >
                <h4>Nouveaux Stickers</h4>
                <Divider style={{ width: '90%' }} />
                <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[
                        {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                        },
                    ]}
                    colors={['var(--default-red)']}
                />
            </Box>
        </div>
    )
}

export { Gloopstatistics }

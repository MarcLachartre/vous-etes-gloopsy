import Box from '@mui/material/Box'
import { LineChart } from '@mui/x-charts/LineChart'
import styles from '../../../css/my-account-page/gloopstatistic.module.scss'
import { useEffect, useState } from 'react'
import { axisClasses } from '@mui/x-charts/ChartsAxis'
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid'

export const GraphCount = ({
    twelveMonthsCount,
}: {
    twelveMonthsCount: number[] | undefined
}) => {
    const [data, setData] = useState<number[]>([])
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    const xValues = () => {
        const currentTimestamp = Date.now()
        const currentMonth = new Date(currentTimestamp).getMonth()

        const xValues = []
        for (let i = 0; i <= 11; i++) {
            const month = new Date(
                new Date(currentTimestamp / 1000).setMonth(currentMonth - i)
            ).getMonth()

            xValues[11 - i] = months[month]
        }

        return xValues
    }

    useEffect(() => {
        twelveMonthsCount ? setData(twelveMonthsCount) : false
    }, [twelveMonthsCount])

    const otherSetting = {
        yAxis: [{ label: 'Quantité' }],
        sx: {
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translateX(-10px)',
            },
            [`& .${chartsGridClasses.line}`]: {
                strokeDasharray: '5 3',
                strokeWidth: 2,
            },

            [`& .${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translateX(-10px)',
            },
        },
    }

    return (
        <Box
            className={styles.chartContainer}
            sx={{
                borderRadius: 1,
            }}
        >
            <LineChart
                xAxis={[
                    {
                        data: xValues(),
                        label: '12 derniers mois',
                        scaleType: 'point',
                    },
                ]}
                series={[
                    {
                        curve: 'linear',
                        data: data,
                        label: 'Stickers Posés',
                    },
                ]}
                colors={['var(--default-red)']}
                grid={{ horizontal: true, vertical: true }}
                {...otherSetting}
            />
        </Box>
    )
}

import Box from '@mui/material/Box'
import styles from '../../../css/my-account-page/gloopstatistic.module.scss'
import { useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'

export const MonthlyCount = ({
    monthlyCount,
}: {
    monthlyCount: number | undefined
}) => {
    return (
        <Box className={styles.dataContainer} bgcolor={'white'}>
            <p className={styles.dataTitle}>Ce mois-ci</p>
            <div className={styles.dataValue}>
                {!monthlyCount ? (
                    <Skeleton style={{ width: '50%', height: '100%' }} />
                ) : (
                    <h3>{monthlyCount}</h3>
                )}
            </div>
        </Box>
    )
}

import styles from '../../../css/my-account-page/gloopstatistic.module.scss'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

export const YearlyCount = ({
    yearlyCount,
}: {
    yearlyCount: number | undefined
}) => {
    return (
        <Box className={styles.dataContainer} bgcolor={'white'}>
            <p className={styles.dataTitle}>Cette année</p>
            <div className={styles.dataValue}>
                {!yearlyCount ? (
                    <Skeleton style={{ width: '50%', height: '100%' }} />
                ) : (
                    <h3>{yearlyCount}</h3>
                )}
            </div>
        </Box>
    )
}

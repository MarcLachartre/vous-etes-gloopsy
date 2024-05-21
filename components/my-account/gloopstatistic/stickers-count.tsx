import Box from '@mui/material/Box'
import styles from '../../../css/my-account-page/gloopstatistic.module.scss'
import Skeleton from '@mui/material/Skeleton'

export const StickersCount = ({
    allTimeCount,
}: {
    allTimeCount: number | undefined
}) => {
    return (
        <Box
            className={styles.dataContainer}
            bgcolor={'white'}
            sx={{
                borderRadius: 1,
            }}
        >
            <p className={styles.dataTitle}>All time</p>
            <div className={styles.dataValue}>
                {!allTimeCount ? (
                    <Skeleton style={{ width: '50%', height: '100%' }} />
                ) : (
                    <h3>{allTimeCount}</h3>
                )}
            </div>
        </Box>
    )
}

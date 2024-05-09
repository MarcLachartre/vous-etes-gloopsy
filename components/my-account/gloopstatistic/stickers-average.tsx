import Box from '@mui/material/Box'
import styles from 'css/my-account-page/gloopstatistic.module.scss'
export const StickersAverage = () => {
    return (
        <Box
            className={styles.dataContainer}
            bgcolor={'white'}
            sx={{
                borderRadius: 1,
            }}
        >
            <p className={styles.dataTitle}>
                Moyenne par mois (12 derniers mois)
            </p>
            <div className={styles.dataValue}>
                <h3>2,7</h3>
            </div>
        </Box>
    )
}

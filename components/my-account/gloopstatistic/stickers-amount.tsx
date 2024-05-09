import Box from '@mui/material/Box'
import styles from 'css/my-account-page/gloopstatistic.module.scss'

export const StickersAmount = ({ amount }: { amount: number | undefined }) => {
    return (
        <Box
            className={styles.dataContainer}
            bgcolor={'white'}
            sx={{
                borderRadius: 1,
            }}
        >
            <p className={styles.dataTitle}>Stickers</p>
            <div className={styles.dataValue}>
                <h3>{amount}</h3>
            </div>
        </Box>
    )
}

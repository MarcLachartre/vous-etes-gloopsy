import styles from '../../css/utils/close-button.module.scss'
import CloseIcon from '@mui/icons-material/Close'

const CloseButton = () => {
    return (
        <div className={styles.closeButtonContainer}>
            <img src="/image-empty.png" alt="close" />
            <CloseIcon
                // fontSize="large"
                sx={{
                    color: 'var(--default-red)',
                    fontSize: 'calc(var(--round-icon-size) / 2)',
                }}
            />
        </div>
    )
}

export default CloseButton

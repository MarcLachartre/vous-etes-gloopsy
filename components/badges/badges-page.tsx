import styles from '../../css/badges-page/badges.module.scss'
import Collection from './collection'
import CustomLayout from '../custom-layout'
import Box from '@mui/material/Box'

export default async function Page({
    initialMarkersLength,
}: {
    initialMarkersLength: number
}) {
    return (
        <CustomLayout count={initialMarkersLength}>
            <div className={styles.titleContainer}>
                <Box component="section" sx={{ p: 2, width: '100%' }}>
                    <h5>Nos Badges Gloopsy</h5>
                </Box>
            </div>

            <Collection />
        </CustomLayout>
    )
}

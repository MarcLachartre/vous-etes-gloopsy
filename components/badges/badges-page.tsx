import styles from '../../css/badges-page/badges.module.scss'
import Collection from './collection'
import CustomLayout from '../custom-layout'

export default async function Page({
    initialMarkersLength,
}: {
    initialMarkersLength: number
}) {
    return (
        <CustomLayout count={initialMarkersLength}>
            <div className={styles.titleContainer}>
                <h1>Nos Badges Gloopsy</h1>
            </div>
            <Collection />
        </CustomLayout>
    )
}

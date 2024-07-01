import style from '../../../css/map-page/add-marker.module.scss'
import adrien from '../../../css/adrien.module.scss'

export const LoadingInterface = () => {
    return (
        <div className={style.inputType}>
            <img
                src="/adrien.png"
                alt="adrien-wait"
                className={adrien.loadingAdrien}
            />
        </div>
    )
}

export default LoadingInterface

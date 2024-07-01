import style from '../../../css/map-page/add-marker.module.scss'

export const ErrorInterface = () => {
    return (
        <div className={style.inputType}>
            <p>Oups! Quelque chose ne s'est pas bien passé! Try again!</p>
        </div>
    )
}

export default ErrorInterface

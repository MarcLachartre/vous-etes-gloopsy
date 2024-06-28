import style from '../../../css/map-page/add-marker.module.scss'

export const AccessDeniedInterface = () => {
    return (
        <div className={style.inputType}>
            <h6>Acces refusé</h6>
            <p>Vous n'êtes pas autorisé à réaliser cette action. </p>
            <p>Merci de contacter le developpeur pour en savoir plus.</p>
        </div>
    )
}

export default AccessDeniedInterface

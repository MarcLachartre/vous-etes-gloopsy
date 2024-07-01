import style from '../../../css/map-page/add-marker.module.scss'
import adrien from '../../../css/adrien.module.scss'

export const SigninInterface = () => {
    return (
        <div className={style.inputType}>
            <p>Connecte toi pour ajouter un pin</p>
            <a href="/api/auth/signin">Sign in</a>
            <img src="/adrien.png" alt="adrien" className={adrien.hiAdrien} />
        </div>
    )
}

export default SigninInterface

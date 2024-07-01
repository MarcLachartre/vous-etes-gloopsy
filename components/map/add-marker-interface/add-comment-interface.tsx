import style from '../../../css/map-page/add-marker.module.scss'
import Button from '@mui/material/Button'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TextField from '@mui/material/TextField'
import AddPicture from '../add-picture'
import { Dispatch, FormEventHandler, SetStateAction } from 'react'

const AddCommentInterface = ({
    setInterfaceName,
    handleSubmit,
}: {
    setInterfaceName: Dispatch<SetStateAction<string>>
    handleSubmit: FormEventHandler<HTMLFormElement>
}) => {
    return (
        <form onSubmit={handleSubmit} className={style.inputType}>
            <p>Ajoute un commentaire et/ou une photo</p>
            <TextField
                name="comment"
                id="outlined-multiline-static"
                label="Commentaire"
                multiline
                fullWidth
                placeholder="Un petit commentaire et c'est tout bon! 😊 (max 300 charactères)"
                rows={4}
            />
            <AddPicture editPic={false} />
            <Button
                type="submit"
                variant="outlined"
                fullWidth
                onClick={function () {
                    setInterfaceName('loading')
                }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>Enregistrer</div> <CheckCircleOutlineIcon />
            </Button>
        </form>
    )
}

export default AddCommentInterface

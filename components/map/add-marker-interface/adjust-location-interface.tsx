import style from '../../../css/map-page/add-marker.module.scss'
import Button from '@mui/material/Button'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import { Dispatch, SetStateAction } from 'react'

const AdjustLocationInterface = ({
    setInterfaceName,
}: {
    setInterfaceName: Dispatch<SetStateAction<string>>
}) => {
    return (
        <div className={style.inputType}>
            <p>Clique pour ajuster la position si besoin!</p>
            <Button
                variant="outlined"
                fullWidth
                onClick={function () {
                    setInterfaceName('add comment')
                }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>Valider position</div>
                <PinDropOutlinedIcon fontSize="small" />
            </Button>
        </div>
    )
}

export default AdjustLocationInterface

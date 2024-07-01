import style from '../../../css/map-page/add-marker.module.scss'
import Button from '@mui/material/Button'
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined'
import { Dispatch, SetStateAction } from 'react'
import SearchAddress from '../search-address'

const ManualLocalizationInterface = ({
    setInterfaceName,
    setCoords,
}: {
    setInterfaceName: Dispatch<SetStateAction<string>>
    setCoords: Dispatch<SetStateAction<number[]>>
}) => {
    return (
        <div className={style.inputType}>
            <p style={{ textAlign: 'center' }}>
                Clique sur la map pour sticker!
            </p>
            <SearchAddress setCoords={setCoords} />
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
                <div>Valider position</div> <PinDropOutlinedIcon />
            </Button>
        </div>
    )
}

export default ManualLocalizationInterface

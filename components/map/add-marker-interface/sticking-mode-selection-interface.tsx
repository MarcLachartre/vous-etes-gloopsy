import style from '../../../css/map-page/add-marker.module.scss'
import Button from '@mui/material/Button'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PanToolAltIcon from '@mui/icons-material/PanToolAlt'
import { Dispatch, SetStateAction } from 'react'

const StickingModeSelectionInterface = ({
    setInterfaceName,
}: {
    setInterfaceName: Dispatch<SetStateAction<string>>
}) => {
    return (
        <div className={style.inputType}>
            <p>Comment souhaites-tu sticker?</p>
            <div className={style.localisationChoiceContainer}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={function () {
                        setInterfaceName('localisation ongoing')
                    }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>Me localiser</div>
                    <MyLocationIcon fontSize="small" />
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={function () {
                        setInterfaceName('manual localisation')
                    }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>Manuellement</div> <PanToolAltIcon fontSize="small" />
                </Button>
            </div>
        </div>
    )
}

export default StickingModeSelectionInterface

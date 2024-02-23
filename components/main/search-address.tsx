import Button from '@mui/material/Button'
import styles from '../../css/main-page/search-address.module.scss'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import {
    Dispatch,
    SetStateAction,
    SyntheticEvent,
    useContext,
    useState,
} from 'react'
import { MapContext } from '@/context/map-context'

const SearchAddress = ({
    setCoords,
}: {
    setCoords: Dispatch<SetStateAction<number[]>>
}) => {
    const map = useContext(MapContext)
    const [address, setAddress] = useState<string>('')

    const searchAddress = () => {
        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                address
            )}.json?access_token=pk.eyJ1IjoibWFyY2xhY2hhcnRyZSIsImEiOiJjbGxjZzRqeGMwMTI2M2NsdzA4bXJodnFqIn0.rEH7luhuGuag_BVbVvw67g`
        )
            .then((response) => response.json())
            .then((data) => {
                // Get the coordinates of the first result
                var coordinates = data.features[0].geometry.coordinates
                // Fly to the location
                map.flyTo({
                    center: coordinates,
                    zoom: 18,
                    duration: 3000,
                    essential: true,
                })
                setCoords([coordinates[0], coordinates[1]])
            })
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        searchAddress()
    }

    const handleChange = (e: any) => {
        setAddress(e.target.value)
    }

    return (
        <form className={styles.searchAddressContainer} action="">
            <TextField
                label="Addresse"
                fullWidth
                value={address}
                onChange={handleChange}
            />
            <Button
                variant="outlined"
                type="submit"
                onClick={(e) => {
                    handleSubmit(e)
                }}
            >
                <SearchIcon />
            </Button>
        </form>
    )
}

export default SearchAddress

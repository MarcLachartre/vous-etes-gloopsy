'use client'

import styles from '../../css/main-page/filters.module.scss'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import { Fragment, useEffect, useState, type Dispatch } from 'react'
import Box from '@mui/material/Box'
import ListSubheader from '@mui/material/ListSubheader'
import CloseButton from '../util/close-button'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

const Filters = ({
    showAllMarkers,
    setShowAllMarkers,
}: {
    showAllMarkers: boolean
    setShowAllMarkers: Dispatch<boolean>
}) => {
    const [filterValue, setFilterValue] = useState('Tous les stickers')
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue((event.target as HTMLInputElement).value)
        setOpen(true)
    }
    const [open, setOpen] = useState(false)

    const toggleDrawer = (newOpen: boolean) => () => {
        showAllMarkers ? setFilterValue('Tous les stickers') : false
        setOpen(newOpen)
    }

    useEffect(() => {
        console.log('cul')
        switch (filterValue) {
            case 'Tous les stickers':
                setShowAllMarkers(true)
                break

            case 'Les 10 derniers':
                setShowAllMarkers(true)
                break

            default:
                setShowAllMarkers(false)
                break
        }
    }, [filterValue])

    const DrawerList = (
        <Box
            sx={{ width: 250 }}
            role="Filters"
            className={styles.drawerContainer}
            onClick={toggleDrawer(false)}
        >
            <ListSubheader>
                <div className={styles.filtersHeader}>
                    <h5>Filtres</h5>
                    <CloseButton />
                </div>
            </ListSubheader>
            <Divider />
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={filterValue}
                onChange={handleChange}
                className={styles.filtersList}
            >
                <FormControlLabel
                    value="Tous les stickers"
                    control={<Radio />}
                    label="Tous les stickers"
                />
                <FormControlLabel
                    value="10"
                    control={<Radio />}
                    label="Les 10 derniers"
                />
            </RadioGroup>
        </Box>
    )

    return (
        <Fragment>
            <div className={styles.filtersIcon}>
                <FilterAltOutlinedIcon
                    onClick={toggleDrawer(true)}
                    fontSize="medium"
                />
            </div>
            <Drawer open={open} onClose={toggleDrawer(false)} anchor={'left'}>
                {DrawerList}
            </Drawer>
        </Fragment>
    )
}

export default Filters

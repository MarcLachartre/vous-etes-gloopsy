'use client'
import styles from '../../css/layout/menu.module.scss'

import { useState } from 'react'

import { useSession } from 'next-auth/react'

import CloseButton from '../util/close-button'

import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Divider, Drawer, ListItemButton, ListItemIcon } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PolicyIcon from '@mui/icons-material/Policy'
import ListSubheader from '@mui/material/ListSubheader'
import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'

const Menu = () => {
    const session = useSession()
    const user = session.data?.user

    const [open, setOpen] = useState(false)

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen)
    }

    const DrawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
        >
            <List>
                <ListSubheader component="h1">
                    <div className={styles.menuHeader}>
                        <h5>Menu</h5>
                        <CloseButton />
                    </div>
                </ListSubheader>
                <Divider sx={{ marginBottom: 'var(--default-spacing)' }} />
                {[
                    ['Home', <HomeIcon />, '/'],
                    ['Map', <MapIcon />, '/map'],
                    !!user && user.role === 'MEMBER'
                        ? ['Badges', <MilitaryTechIcon />, '/badges']
                        : [],
                    !!user && user.role === 'MEMBER'
                        ? ['Mon compte', <PersonIcon />, '/my-account']
                        : [],
                    !!user
                        ? ['Sign out', <LogoutIcon />, '/api/auth/signout']
                        : ['Sign in', <LoginIcon />, '/api/auth/signin'],
                    ['Privacy policy', <PolicyIcon />, 'privacy-policy'],
                ].map((item) =>
                    item.length !== 0 ? (
                        <ListItem key={`${item[0]}`} disablePadding>
                            <ListItemButton
                                component="a"
                                href={`${item[2]}`}
                                sx={{ marginBottom: 'var(--default-spacing)' }}
                            >
                                <ListItemIcon>{item[1]}</ListItemIcon>
                                <p>{item[0]}</p>
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        false
                    )
                )}
            </List>
        </Box>
    )

    return [
        <div
            key={'menu-icon'}
            className={styles.menuIconContainer}
            onClick={() => {
                setOpen(!open)
            }}
        >
            <img src="/empty-image-no-border.png" alt="menu-image-empty" />
            <MenuRoundedIcon
                sx={{
                    color: 'var(--default-red)',
                    fontSize: 'calc(var(--round-icon-size) / 1.7)',
                }}
            />
        </div>,
        <Drawer
            key={'menu-drawer'}
            open={open}
            onClose={toggleDrawer(false)}
            anchor="right"
        >
            {DrawerList}
        </Drawer>,
    ]
}

export default Menu

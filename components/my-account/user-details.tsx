'use client'
import Alert, {
    AlertColor,
    AlertPropsColorOverrides,
} from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import styles from '../../css/my-account-page/user-details.module.scss'
import { useState } from 'react'
import { OverridableStringUnion } from '@mui/types'
import { usernameValidation } from '../../lib/username-validation'
import adrien from '../../css/adrien.module.scss'

const UserDetails = ({
    userName,
    updateUsername,
}: {
    userName: string | undefined | null
    updateUsername: (arg: string) => {}
}) => {
    const [user, setUsername] = useState<string | null | undefined>(userName)
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [openSnackbar, setOpenSnackbar] = useState<{
        open: boolean
        severity:
            | OverridableStringUnion<AlertColor, AlertPropsColorOverrides>
            | undefined
        message: string
    }>({ open: false, severity: undefined, message: '' })
    const [usernameValidity, setUsernameValidity] = useState<{
        isValid: boolean | undefined
        errors: string[]
    }>({
        isValid: undefined,
        errors: [],
    })

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setUsernameValidity({
            isValid: undefined,
            errors: [],
        })
        setOpen(false)
    }

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackbar((previousValue) => {
            return {
                open: false,
                severity: previousValue.severity,
                message: previousValue.message,
            }
        })
    }

    const handleChange = async (event: {
        currentTarget: { value: string }
    }) => {
        const validity = await usernameValidation(event.currentTarget.value)
        setUsernameValidity(validity)
    }

    return (
        <div className={styles.userDetailsContainer}>
            <div className={styles.userDetails}>
                <img
                    className={styles.img}
                    src="/image-empty.png"
                    alt="image-user-details"
                />
                <h6>{user}</h6>
                <a onClick={handleClickOpen}>Changer pseudo</a>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: async (
                            event: React.FormEvent<HTMLFormElement>
                        ) => {
                            setLoading(true)
                            event.preventDefault()

                            const formData = new FormData(event.currentTarget)
                            const formJson = Object.fromEntries(
                                (formData as any).entries()
                            )
                            const username = formJson.username
                            const res = (await updateUsername(username)) as {
                                ok: boolean
                                status: number
                            }

                            if (await res.ok) {
                                setOpenSnackbar({
                                    open: true,
                                    severity: 'success',
                                    message: 'Username mis à jour!',
                                })
                                setUsername(username)
                            } else {
                                setOpenSnackbar({
                                    open: true,
                                    severity: 'error',
                                    message: 'Erreur! Réessaye plus tard',
                                })
                            }
                            setLoading(false)
                            handleClose()
                        },
                    }}
                >
                    {!loading ? (
                        [
                            <DialogTitle key={'username-dialog-title'}>
                                Vous êtes ...
                            </DialogTitle>,
                            <DialogContent key={'username-dialog-content'}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    autoComplete="off"
                                    placeholder="Gloopsy"
                                    error={
                                        usernameValidity.isValid !==
                                            undefined &&
                                        !usernameValidity.isValid
                                    }
                                    name="username"
                                    label="Username"
                                    type="username"
                                    fullWidth
                                    variant="filled"
                                    style={{ width: '200px' }}
                                    inputProps={{ maxLength: 30 }}
                                    onChange={handleChange}
                                    helperText={usernameValidity.errors[0]}
                                />
                            </DialogContent>,
                            <DialogActions key={'username-dialog-actions'}>
                                <Button onClick={handleClose}>Annuler</Button>
                                <Button
                                    type="submit"
                                    disabled={!usernameValidity.isValid}
                                >
                                    Valider
                                </Button>
                            </DialogActions>,
                        ]
                    ) : (
                        <img
                            src="/adrien.png"
                            alt="adrien-wait"
                            className={adrien.loadingAdrien}
                            style={{ margin: '30px' }}
                        />
                    )}
                </Dialog>
            </div>
            <Snackbar
                open={openSnackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={openSnackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {openSnackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export { UserDetails }

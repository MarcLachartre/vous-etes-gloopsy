'use client'
import { MarkersAmountStateContext } from '@/context/markers-amount-context'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import styles from '../../css/badges-page/badges.module.scss'
import { ReactElement, useContext } from 'react'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Unstable_Grid2'

// Comment ajouter un badge:
// Un badge doit etre:
// - une image au format png
// - de taille 800x800px
// - ajoutée au dossier public/badges/
// Il faut aussi ajouter un "message" dans le message array

export default function Collection() {
    const { markersAmount } = useContext(MarkersAmountStateContext)

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: 'calc(var(--default-spacing) + 3px)',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'var(--box-shadow)',

        color: theme.palette.text.secondary,
    }))

    const imagesArray: {
        displayValue: number
        badge: ReactElement
        message: any
    }[] = []

    const messages = [
        "Regardez ce mec, il a déjà tous les badges, c'est sûr.",
        'Lourd! Un Gloops shiny en plus!',
        "Fast'n'Youyou - Gloopsy Edition",
    ]

    for (let i = 0; i < 12; i++) {
        imagesArray.push({
            displayValue: (i + 1) * 50,

            badge:
                markersAmount >= (i + 1) * 50 ? (
                    <img // png image has to be a 800x800 px
                        src={`/badges/badge${i + 1}.png`}
                        alt={`/badges/badge${i + 1}.png`}
                    />
                ) : (
                    <div className={styles.lockedBadge}>
                        <CatchingPokemonIcon
                            sx={{ fontSize: 30, color: 'var(--default-red)' }}
                        />
                        <p> À dégloopser </p>
                    </div>
                ),
            message:
                markersAmount >= (i + 1) * 50 ? (
                    <div className={styles.badgeDescription}>
                        <h5>{(i + 1) * 50} stickers </h5>

                        <p>{messages[i]}</p>
                    </div>
                ) : (
                    false
                ),
        })
    }

    return (
        <div>
            <Grid
                container
                spacing={'var(--default-spacing)'}
                columns={{ xs: 4, sm: 12, md: 12 }}
                margin={0}
                // style={{ gap: 'var(--default-spacing)' }}
            >
                {imagesArray.map((image) => (
                    <Grid
                        minHeight={320}
                        xs={2}
                        sm={4}
                        md={3}
                        key={`badge${image.displayValue}`}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{ padding: 'calc(var(--default-spacing) / 2)' }}
                    >
                        <Item>
                            <div className={styles.badgeContainer}>
                                <div>{image.badge}</div>
                                {image.message}
                            </div>
                        </Item>
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}

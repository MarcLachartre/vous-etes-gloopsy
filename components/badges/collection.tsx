'use client'
import { MarkersAmountStateContext } from '@/context/markers-amount-context'
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import styles from '../../css/badges-page/badges.module.scss'
import { ReactElement, useContext } from 'react'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'

// Comment ajouter un badge:
// Un badge doit etre:
// - une image au format png
// - de taille 800x800px
// - ajoutée au dossier public/badges/
// Il faut aussi ajouter un "message" dans le message array

export default function Collection() {
    const { markersAmount } = useContext(MarkersAmountStateContext)

    const Item = styled(Paper)(({ theme }) => ({
        // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
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
        <div className={styles.collectionGrid}>
            {imagesArray.map((image) => (
                <Box
                    className={styles.badgeContainer}
                    key={`badge${image.displayValue}`}
                    boxShadow={'var(--box-shadow)'}
                >
                    {image.badge}
                    {image.message}
                </Box>
            ))}
        </div>
    )
}

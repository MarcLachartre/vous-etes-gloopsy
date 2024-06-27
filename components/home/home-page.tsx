'use client'
import { useEffect, useRef } from 'react'
import styles from '../../app/page.module.css'
import Typed from 'typed.js'
import { Button } from '@mui/material'
import MapIcon from '@mui/icons-material/Map'

export default function HomePage({ usernames }: { usernames: string[] }) {
    const el = useRef(null)

    useEffect(() => {
        const typedNames = new Typed(el.current, {
            strings: usernames,
            typeSpeed: 80,
            startDelay: 1550,
            loop: true,
            backSpeed: 25,
            backDelay: 2000,
        })

        return () => {
            // Destroy Typed instance during cleanup to stop animation
            typedNames.destroy()
        }
    }, [])

    return (
        <div className={styles.homepageContainer}>
            <p className={styles.intro}>Salut, maintenant vous aussi...</p>
            <p className={styles.names}>
                <span ref={el} />
            </p>
            <div className={styles.mapLink}>
                <Button
                    variant="contained"
                    style={{
                        backgroundColor: 'var(--default-red)',
                        borderRadius: 'var(--border-radius)',
                    }}
                    endIcon={<MapIcon />}
                    size="large"
                    href="/map"
                >
                    La gloops'map
                </Button>
            </div>
        </div>
    )
}

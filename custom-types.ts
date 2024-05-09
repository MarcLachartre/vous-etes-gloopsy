interface GeoJson {
    geometry: {
        type: FormDataEntryValue | null
        coordinates: number[]
    }
    properties: {
        owner: FormDataEntryValue | null
        description: FormDataEntryValue | null
        email: FormDataEntryValue | null
        date: string
        time: string
        picturePublicId?: string
        pictureURL?: string
    }
}

export type { GeoJson }

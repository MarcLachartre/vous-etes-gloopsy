class DataValidation {
    data: any
    isValid: boolean | null
    error: string[]
    constructor(data: any) {
        this.data = data
        this.isValid = null
        this.error = []
    }

    async validatePictureType() {
        const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg']

        if (validImageTypes.includes(await this.data.type)) {
            this.isValid !== false
                ? (this.isValid = true)
                : (this.isValid = false)
            console.log('valid pic type')
        } else {
            console.log('Formats acceptés: png/jpg/jpeg')
            this.error.push('Formats acceptés: png/jpg/jpeg')
            this.isValid = false
        }
    }

    async validatePictureSize() {
        const maxSize = 10000

        if ((await this.data.size) / 1000 <= maxSize) {
            this.isValid !== false
                ? (this.isValid = true)
                : (this.isValid = false)

            console.log('valid pic size')
        } else {
            console.log('Image trop lourde, poids max: 10Mo')
            this.error.push('Image trop lourde, poids max: 10Mo')
            this.isValid = false
        }
    }
}

export default DataValidation

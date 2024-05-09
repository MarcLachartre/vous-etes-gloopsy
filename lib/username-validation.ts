// 'use server'
export const usernameValidation = (username: string) => {
    // if username length = 0, if username length > 30 return errors in an array
    const errors: string[] = []

    if (username.length === 0) {
        errors.push('Merci de renseigner ce champs.')
    } else if (username.length > 30) {
        errors.push('Maximum 30 charactères autorisés.')
    }

    const isValid: boolean = errors.length === 0 ? true : false
    return { isValid: isValid, errors: errors }
}

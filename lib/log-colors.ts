export const logColor = (color: 'blue' | 'green' | 'red', msg: string) => {
    let colorToDisplay: string
    switch (color) {
        case 'blue':
            colorToDisplay = `\u001b[36m ${msg} \u001b[0m`
            break
        case 'green':
            colorToDisplay = `\u001b[32m ${msg} \u001b[0m`
            break
        case 'red':
            colorToDisplay = `\u001b[31m ${msg} \u001b[0m`
            break
        default:
            return
    }
    return colorToDisplay
}

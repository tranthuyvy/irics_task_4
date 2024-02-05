import validator from 'validator'

export const validatePassword = async ({ password }) => {
    const errors = []

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    if (!password) {
        errors.push({ field: 'password', message: 'password field are required' })
    } else if (!validator.isLength(password, { min: 8 })) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters long' })
    } else if (!passwordRegex.test(password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' })
    }
    return errors
}
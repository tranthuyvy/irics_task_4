import validator from 'validator'

export const validateRegistration = ({ name, username, email, password }) => {
  const errors = []

  if (!name || !username || !email || !password) {
    errors.push('All fields are required')
  }

  if (!validator.isEmail(email)) {
    errors.push('Invalid email address')
  }

  return errors
}
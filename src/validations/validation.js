import validator from 'validator'
import { findUserByUsernameOrEmailOrId } from '../models/user'

export const validateRegistration = async ({ name, username, email, password }) => {
  const errors = []
  const nameRegex = /^[a-zA-Z0-9 !@#$%^&*()-_+=<>?/{}|[\]:'',.]+$/
  const usernameRegex = /^[a-zA-Z0-9]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

  if (!name) {
    errors.push({ field: 'name', message: 'name field are required' })
  } else if (!nameRegex.test(name)) {
    errors.push({ field: 'name', message: 'Invalid characters in the name field' })
  }

  if (!username) {
    errors.push({ field: 'username', message: 'username field are required' })
  } else if (!validator.isLength(username, { min: 1, max: 30 })) {
    errors.push({ field: 'username', message: 'Username must be between 1 and 30 characters long' })
  } else if (!usernameRegex.test(username)) {
    errors.push({ field: 'username', message: 'Username can only contain letters and numbers, and cannot contain special characters or spaces' })
  } else {
    const existingUserByUsername = await findUserByUsernameOrEmailOrId(username)
    if (existingUserByUsername) {
      errors.push({ field: 'username', message: 'Username already exists' })
    }
  }

  if (!email) {
    errors.push({ field: 'email', message: 'email field are required' })
  } else if (!validator.isEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email address' })
  } else {
    const existingUserByEmail = await findUserByUsernameOrEmailOrId(email)
    if (existingUserByEmail) {
      errors.push({ field: 'email', message: 'Email already exists' })
    }
  }

  if (!password) {
    errors.push({ field: 'password', message: 'password field are required' })
  } else if (!validator.isLength(password, { min: 8 })) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' })
  } else if (!passwordRegex.test(password)) {
    errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' })
  }

  return errors
}
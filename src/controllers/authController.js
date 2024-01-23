import bcrypt from 'bcrypt'
import HttpStatus from 'http-status-codes'
import { validateRegistration } from '../validations/validation'
import { addUser } from '../models/user'

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const validationErrors = await validateRegistration({ name, username, email, password })

    if (validationErrors.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Bad request!',
        error_code: 'INVALID_INPUT',
        success: false,
        error: validationErrors
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      name,
      username,
      email,
      password: hashedPassword
    }

    addUser(newUser)

    return res.status(HttpStatus.CREATED).json({ message: 'Success!', success: true })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}

export { registerUser }

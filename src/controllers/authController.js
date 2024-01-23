import bcrypt from 'bcrypt'
import HttpStatus from 'http-status-codes'
import { validateRegistration } from '../validations/validation'
import { addUser } from '../models/user'
import { findUserByUsernameOrEmail } from '../models/user'
import { generateKey, encryptWithRSA, decryptWithRSA } from '../utils/rsaCrypt'

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

    // Bcrypt băm pass
    const hashedPassword = await bcrypt.hash(password, 10)

    // generateKey RSA
    const { publicKey, privateKey } = generateKey(hashedPassword)

    // Mã hóa bằng RSA
    const encryptedPassword = encryptWithRSA(publicKey, hashedPassword)

    const newUser = {
      name,
      username,
      email,
      password: encryptedPassword,
      rsaPublicKey: publicKey,
      rsaPrivateKey: privateKey
    }

    addUser(newUser)

    return res.status(HttpStatus.CREATED).json({ message: 'Success!', success: true })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { usernameoremail, password } = req.body

    const user = findUserByUsernameOrEmail(usernameoremail)
    console.log('user:', user)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found', success: false })
    }

    // Bcrypt băm pass
    const hashedPassword = await bcrypt.hash(password, 10)

    // Mã hóa bằng RSA
    const encryptedPassword = encryptWithRSA(user.rsaPublicKey, hashedPassword)

    if (encryptedPassword !== user.password) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid password', success: false })
    }

    return res.status(HttpStatus.OK).json({ message: 'Login successful', success: true })
  } catch (error) {
    console.error(error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}

export { registerUser, loginUser }

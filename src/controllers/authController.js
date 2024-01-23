import bcrypt from 'bcrypt'
import HttpStatus from 'http-status-codes'
import { validateRegistration } from '../validations/validation'
import { addUser } from '../models/user'
import { generateKey, encryptWithRSA } from '../utils/rsa'

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

    // generateKey RSA
    const { publicKey, privateKey } = generateKey(password)

    // Mã hóa bằng RSA
    const encryptedPassword = encryptWithRSA(publicKey, password)

    // Bcrypt băm pass đã mã hóa RSA
    const hashedPassword = await bcrypt.hash(encryptedPassword, 10)

    const newUser = {
      name,
      username,
      email,
      password: hashedPassword,
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

export { registerUser }

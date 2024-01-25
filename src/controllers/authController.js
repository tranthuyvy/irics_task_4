import bcrypt from 'bcrypt'
import HttpStatus from 'http-status-codes'
import { validateRegistration } from '../validations/validation'
import { addUser } from '../models/user'
import { findUserByUsernameOrEmail } from '../models/user'
import { generateKeyPair, encryptWithRSA, decryptWithRSA } from '../utils/rsaCrypt'
import JWT from 'jsonwebtoken'

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

    //generateKey
    const { publicKey, privateKey } = generateKeyPair()

    // Bcrypt băm pass
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      avatar: 'https://test3.stechvn.org/api/file/318323afa-8a24-11ee-a1eb-0242c0a83003.Circle_user.svg',
      name,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().getTime(),
      background_img: 'https://test3.stechvn.org/api/file/3504639c8-8a24-11ee-9529-0242c0a83003.Grey_and_Brown_Modern_Beauty_Salon_Banner_20231024_124517_0000.svg',
      rsaPublicKey: publicKey,
      rsaPrivateKey: privateKey
    }

    addUser(newUser)

    return res.status(HttpStatus.CREATED).json({ message: 'Success!', success: true })
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}

const getPublicKey = (req, res) => {
  try {
    const { usernameoremail } = req.body

    const user = findUserByUsernameOrEmail(usernameoremail)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found', success: false })
    }

    return res.status(HttpStatus.OK).json({ publicKey: `${user.rsaPublicKey}`, success: true })
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}

const getPasswordLogin = (req, res) => {
  try {
    const { usernameoremail, text } = req.body

    const user = findUserByUsernameOrEmail(usernameoremail)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found', success: false })
    }

    const encryptedPassword = encryptWithRSA(user.rsaPublicKey, text)

    return res.status(HttpStatus.OK).json({ password: `${encryptedPassword}`, success: true })
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { usernameoremail, password } = req.body

    const user = findUserByUsernameOrEmail(usernameoremail)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found', success: false })
    }

    // const encryptedPassword = encryptWithRSA(user.rsaPublicKey, password)
    // console.log(encryptedPassword)

    const decryptedPassword = decryptWithRSA(user.rsaPrivateKey, password)

    const result = bcrypt.compare(decryptedPassword, user.password)

    if (!result) {
      return res.status(HttpStatus.CONFLICT).json({ message: 'Wrong password', success: false })
    }

    const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' })
    const tokenExpiration = JWT.decode(token).exp

    const token_chat = JWT.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' })
    const tokenChatExpiration = JWT.decode(token_chat).exp

    const refreshToken = JWT.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    const refreshTokenExpiration = JWT.decode(refreshToken).exp

    const csrfToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    res.cookie('csrfToken', csrfToken)

    res.cookie('JWT', refreshToken, {
      httpOnly: true,
      sameSite: 'None', secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    const userDisplay = { ...user, rsaPrivateKey: undefined, rsaPublicKey: undefined }

    return res.status(HttpStatus.OK).json({
      message: 'Successful',
      success: true,
      token,
      expired_at_token : tokenExpiration,
      token_chat,
      expired_at_token_chat: tokenChatExpiration,
      refreshToken,
      refresh_token_expired_at: refreshTokenExpiration,
      xsrf_token: csrfToken,
      user: userDisplay
    })

  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}

const refreshToken = (req, res) => {
  try {
    if (req.cookies?.JWT) {
      const refreshToken = req.cookies.JWT

      JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized', success: false })
          } else {
            const userId = decoded.userId
            const token = JWT.sign({
              userId: userId
            }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' })

            return res.json({ token: token, success: true })
          }
        })
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized', success: false })
    }
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: 'Internal Server Error', success: false })
  }
}

export { registerUser, loginUser, getPublicKey, getPasswordLogin, refreshToken }

import bcrypt from 'bcrypt'
import crypto from 'crypto'
import HttpStatus from 'http-status-codes'
import JWT from 'jsonwebtoken'
import { validateRegistration } from '../validations/validation'
import { validatePassword } from '~/validations/validationPass'
import { addUser, findUserByUsernameOrEmailOrId, updatePassword, addUserData } from '../models/user'
import { generateKeyPair, encryptWithRSA, decryptWithRSA } from '../utils/rsaCrypt'
import nodemailer from 'nodemailer'

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
    console.log('Generated Public Key:', publicKey)
    console.log('Generated Private Key:', privateKey)
    // const { publicKey, privateKey } = generateKeyPair(username)

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
      isConversationHidden: [],
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

const getPublicKey = (req, res) => {
  try {
    const { usernameoremail } = req.body

    const user = findUserByUsernameOrEmailOrId(usernameoremail)

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

    const user = findUserByUsernameOrEmailOrId(usernameoremail)

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

    const user = findUserByUsernameOrEmailOrId(usernameoremail)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found', success: false })
    }

    const encryptedPassword = encryptWithRSA(user.rsaPublicKey, password)

    const decryptedPassword = decryptWithRSA(user.rsaPrivateKey, encryptedPassword)

    const result = await bcrypt.compare(decryptedPassword, user.password)

    if (!result) {
      return res.status(HttpStatus.CONFLICT).json({ message: 'Wrong password', success: false })
    }

    // const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' })
    const token = JWT.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '30m' })
    JWT.decode()
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
      expired_at_token: tokenExpiration,
      token_chat,
      expired_at_token_chat: tokenChatExpiration,
      refreshToken,
      refresh_token_expired_at: refreshTokenExpiration,
      xsrf_token: csrfToken,
      user: userDisplay
    })

  } catch (error) {
    console.error(error);
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

const logoutUser = (req, res) => {
  try {
    if (req.cookies && (req.cookies.JWT || req.cookies.csrfToken)) {
      res.clearCookie('JWT')
      res.clearCookie('csrfToken')

      res.status(HttpStatus.OK).json({ message: 'Logout successful', success: true })
    } else {
      res.status(HttpStatus.OK).json({ message: 'Logout successful', success: true })
    }
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: 'Internal Server Error', success: false })
  }
}

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body

    const validationErrors = await validatePassword({ password : newPassword })

    const refreshToken = req.cookies?.JWT

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized', success: false })
    }

    const decodedRefreshToken = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const userId = decodedRefreshToken.userId

    const csrfTokenHeader = req.headers['csrftoken']

    if (!csrfTokenHeader || csrfTokenHeader !== req.cookies.csrfToken) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'CSRF Token mismatch - Unauthorized', success: false })
    }

    const user = findUserByUsernameOrEmailOrId(userId)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found', success: false })
    }

    // const decryptedPassword = decryptWithRSA(user.rsaPrivateKey, newPassword) 

    if (validationErrors.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Bad request!',
        error_code: 'INVALID_INPUT',
        success: false,
        error: validationErrors
      })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    updatePassword(userId, hashedPassword)

    return res.status(HttpStatus.OK).json({ message: 'Success', success: true })

  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: 'Internal Server Error', success: false })
  }
}

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 587,
  secure: false,
  // service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = findUserByUsernameOrEmailOrId(email)

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Email not found', success: false })
    }

    const token = JWT.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' })
    // user.passwordResetToken = token
    // user.passwordResetExpires = Date.now() + //
    // addUserData(user.id, token, token)

    const resetCodes = {}
    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    resetCodes[email] = resetCode

    const resetUrl = `http://${process.env.HOST_NAME}:${process.env.PORT}/reset-password/${resetCode}?token=${token}`

    console.log('URL: ', resetUrl)
    console.log('resetCode: ', resetCode)
    console.log('resetCodeEmail: ', resetCodes)

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <h1>${resetCode}</h1>
    `
    }
    try {
      await transporter.sendMail(mailOptions)
      return res.status(HttpStatus.OK).json({ message: 'Email sent', success: true })
    } catch (err) {
      console.log('error sent email', err)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send password reset email', success: false })
    }
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: 'Internal Server Error', success: false })
  }
}

const resetPassword = async (req, res) => {
  const { code, token } = req.params
  console.log(req.params)
}

const userProfile = (req, res) => {
  try {
    if (req.cookies?.JWT) {
      const token = req.cookies.JWT
      const decodedToken = JWT.verify(token, process.env.REFRESH_TOKEN_SECRET)
      const userId = decodedToken.userId
      const userProfile = findUserByUsernameOrEmailOrId(userId)

      if (!userProfile) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found', success: false })
      }
      const userDisplay = { ...userProfile, rsaPrivateKey: undefined, rsaPublicKey: undefined }
      return res.status(HttpStatus.OK).json({ message: 'Success', success: true, user: userDisplay })
    }
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized', success: false })

  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: 'Internal Server Error', success: false })
  }
}

export { registerUser, loginUser, getPublicKey, getPasswordLogin, refreshToken, logoutUser, changePassword, forgotPassword, resetPassword, userProfile }

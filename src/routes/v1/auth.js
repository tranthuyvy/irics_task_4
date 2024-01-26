import express from 'express'
import { loginUser, registerUser, getPublicKey, getPasswordLogin, refreshToken, logoutUser } from '../../controllers/authController'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/publicKey', getPublicKey)
router.get('/passwordLogin', getPasswordLogin)
router.post('/refresh', refreshToken)
router.post('/logout', logoutUser)

export default router

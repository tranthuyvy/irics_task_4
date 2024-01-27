import express from 'express'
import { loginUser, registerUser, getPublicKey, getPasswordLogin, refreshToken, logoutUser, changePassword } from '../../controllers/authController'
import authenticateToken from '../../middlewares/authenticateToken'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/publicKey', getPublicKey)
router.get('/passwordLogin', getPasswordLogin)
router.post('/refresh', refreshToken)
router.post('/logout', logoutUser)
router.post('/change-password', authenticateToken, changePassword)

export default router

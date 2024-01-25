import express from 'express'
import { loginUser, registerUser, getPublicKey, getPasswordLogin } from '../../controllers/authController'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/publicKey', getPublicKey)
router.get('/passwordLogin', getPasswordLogin)

export default router

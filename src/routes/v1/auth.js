import express from 'express'
import { loginUser, registerUser, getPublicKey } from '../../controllers/authController'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/publicKey', getPublicKey)

export default router

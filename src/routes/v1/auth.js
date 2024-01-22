import express from 'express'
import bcrypt from 'bcrypt'
import HttpStatus from 'http-status-codes'
import { validateRegistration } from '~/validations/validation'

const router = express.Router()

const users = []

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    const validationErrors = validateRegistration({ name, username, email, password })

    if (validationErrors.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: validationErrors })
    }

    const existingUser = users.find(user => user.username === username)

    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({ error: 'Username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      name,
      username,
      email,
      password: hashedPassword
    }

    users.push(newUser)

    // res.json({ user: newUser })
    return res.status(HttpStatus.CREATED).json({success: 'Success'})
  } catch (error) {
    console.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
})

module.exports = router

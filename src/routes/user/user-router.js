const express = require('express')
const path = require('path')

const router = express.Router()
const jsonBodyParser = express.json()

const {
  getUsers,
  insertUser,
  getUser,
  updateUser,
  deleteUser,
  validatePassword,
  hasUserWithUserName,
  hashPassword,
  serializeUser,
} = require('./user-service.js')

router
  .route('/register') // Supports POST
  .post(jsonBodyParser, async (req, res, next) => {
    const { username, password, email } = req.body

    for (const field of ['username', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        })

    try {
      const passwordError = validatePassword(password)

      if (passwordError) return res.status(400).json({ error: passwordError })

      const hasUser = await hasUserWithUserName(
        // req.app.get('db'),
        username
      )

      if (hasUser)
        return res.status(400).json({ error: `Username already taken` })

      const hashedPassword = await hashPassword(password)

      const newUser = {
        username,
        password: hashedPassword,
        email,
      }

      const user = await insertUser(/*req.app.get('db'),*/ newUser)

      res
        .status(200)
        // .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(serializeUser(user))
    } catch (error) {
      next(error)
    }
  })

router
  .route('/login') // Supports POST
  .get((req, res) => {
    getUser(req, res)
  })

router
  .route('/:id') // Support GET
  .get((req, res) => {
    getUser(req, res)
  })

module.exports = router

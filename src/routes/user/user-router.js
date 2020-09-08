const express = require('express')
const router = express.Router()
const jsonBodyParser = express.json()

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  validatePassword,
  hasUserWithUserName,
  hashPassword,
  insertUser,
  serializeUser,
} = require('./user-service.js')

router
  .route('/register') // Supports POST
  .post(jsonBodyParser, async (req, res) => {
    createUser(req, res)
    const { username, password, email } = req.body

    for (const field of ['username', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        })

    try {
      const passwordError = validatePassword(password)

      if (passwordError) return res.status(400).json({ error: passwordError })

      const hasUserWithUserName = await hasUserWithUserName(
        req.app.get('db'),
        username
      )

      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` })

      const hashedPassword = await hashPassword(password)

      const newUser = {
        username,
        password: hashedPassword,
        name,
      }

      const user = await insertUser(req.app.get('db'), newUser)

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
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

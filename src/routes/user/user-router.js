const express = require('express')
const path = require('path')

const router = express.Router()
const jsonBodyParser = express.json()

const {
  createUser,
  getUser,
  validatePassword,
  getUserWithUserName,
  getUserWithEmail,
  hashPassword,
} = require('./user-service.js')

router
  .route('/register') // Supports POST
  .post(jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db')
    const { first_name, last_name, username, password, email } = req.body

    //Check that fields exist
    for (const field of ['username', 'password', 'email'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        })

    try {
      //check that password matches requirements
      const passwordError = validatePassword(password)

      //if password does not meet requirements return error
      if (passwordError) return res.status(400).json({ error: passwordError })

      //checks if username already exists in db
      const hasUsername = await getUserWithUserName(db, username)

      //if username is taken return error
      if (hasUsername)
        return res.status(400).json({ error: `Username unavailable` })

      //checks if email already exists in db
      const hasEmail = await getUserWithEmail(db, email)

      //if email is taken return error
      if (hasEmail)
        return res.status(400).json({ error: `Email already in use` })

      //hash the user's password
      const hashedPassword = await hashPassword(password)

      //build new user object
      const newUser = {
        first_name,
        last_name,
        username,
        password: hashedPassword,
        email,
      }

      //insert new user object into database
      const user = await createUser(db, newUser)

      //respond with a JWT
      res.status(200).json({ authToken: 'JWTString' })
    } catch (error) {
      next(error)
    }
  })

router
  .route('/login') // Supports POST
  .post(jsonBodyParser, async (req, res) => {
    const { username, password } = await req.body

    //Check that fields exist
    for (const field of ['username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        })

    try {
      //check that username OR password exist in db
      const userOrPasswordCorrect = await getUser(username, password)

      //if either is wrong return error DON'T tell user which was incorrect
      if (!userOrPasswordCorrect) {
        return res.status(401).json({ error: `invalid credentials` })
      }

      //respond with a JWT
      res.status(200).json({ authToken: 'JWTString' })
    } catch (error) {
      next(error)
    }
  })

module.exports = router

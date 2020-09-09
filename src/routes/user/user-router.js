const express = require('express')
const path = require('path')

const router = express.Router()
const jsonBodyParser = express.json()

const {
  insertUser,
  getUser,
  validatePassword,
  hasUserWithUserName,
  hashPassword,
} = require('./user-service.js')

router
  .route('/register') // Supports POST
  .post(jsonBodyParser, async (req, res, next) => {
    const { username, password, email } = req.body

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
      const hasUser = await hasUserWithUserName(
        // req.app.get('db'),
        username
      )

      //if username is taken return error
      if (hasUser)
        return res.status(400).json({ error: `Username already taken` })

      //hash the user's password
      const hashedPassword = await hashPassword(password)

      //build new user object
      const newUser = {
        username,
        password: hashedPassword,
        email,
      }

      //insert new user object into database
      const user = await insertUser(/*req.app.get('db'),*/ newUser)

      //respond with a JWT
      res.status(200).json({ authToken: 'JWTString' })
    } catch (error) {
      next(error)
    }
  })

router
  .route('/login') // Supports POST
  .get(jsonBodyParser, async (req, res) => {
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

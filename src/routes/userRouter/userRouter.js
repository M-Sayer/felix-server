const express = require('express')
const router = express.Router()
const jsonBodyParser = express.json()

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('./userRouterService.js')

router
  .route('/register') // Supports POST
  .post(jsonBodyParser, async (req, res) => {
    createUser(req, res)
    const { password, username, email } = req.body

    for (const field of ['name', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`,
        })
    res.status(200).json({ response: 'user created' })
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

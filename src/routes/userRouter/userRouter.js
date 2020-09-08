const express = require('express')
const router = express.Router()

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('./userRouterService.js')

router
  .route('/register') // Supports POST
  .post((req, res) => {
    createUser(req, res)
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

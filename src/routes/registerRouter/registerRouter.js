const express = require('express')
const router = express.Router()

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('./registerRouterServies.js')

router
  .route('/') // Supports GET, POST
  .get((req, res) => {
    getUsers(req, res)
  })
  .post((req, res) => {
    createUser(req, res)
  })

router
  .route('/:id') // Supports GET, PATCH, DELETE
  .get((req, res) => {
    getUser(req, res)
  })
  .patch((req, res) => {
    updateUser(req, res)
  })
  .delete((req, res) => {
    deleteUser(req, res)
  })

module.exports = router

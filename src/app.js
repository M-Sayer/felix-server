chatchawan-users-post-endpoint
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const userRouter = require('./routes/user/user-router')
const errorHandler = require('./middleware/error-handler')

const app = express()

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!')
})

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json()) // accept json requests

app.use('/user', userRouter) //register, login, and get user by id

app.use(errorHandler)

module.exports = app

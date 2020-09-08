const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const userRouter = require('./routes/userRouter/userRouter')

const app = express()

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!')
})

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json()) // accept json requests

app.use(function errorHandler(error, req, res, _next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.log(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

app.use('/user', userRouter)

module.exports = app

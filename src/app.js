const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// Variables
const app = express();
const { NODE_ENV } = require('./config');
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// Middleware
const errorHandler = require('../src/middleware/error-handler');

// Routers
const usersRouter = require('../src/routes/users/users-router');
const transactionRouter = require('../src/routes/transactions/TransactionRouter');

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transaction', transactionRouter);

app.use(errorHandler);

module.exports = app;
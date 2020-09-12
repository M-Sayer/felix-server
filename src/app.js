const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');
const app = express();

const errorHandler = require('../src/middleware/error-handler');

const userRouter = require('../src/routes/user/user-router');
const transactionRouter = require('../src/routes/transactions/TransactionRouter');

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/transaction', transactionRouter);

app.use(errorHandler);

module.exports = app;
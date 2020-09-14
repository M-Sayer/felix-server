const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const transactionRouter = require('./routes/transactions/TransactionRouter');
const userRouter = require('./routes/user/user-router');
const { requireAuth } = require('./middleware/jwt-auth');
const errorHandler = require('./middleware/error-handler');

const app = express();

// Variables
const app = express();
const { NODE_ENV } = require('./config');
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Routers
const usersRouter = require('./routes/users/usersRouter');
const transactionsRouter = require('./routes/transactions/transactionsRouter');

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use('/api/users', userRouter); //register, login, and get user by id

app.use(requireAuth); // every route below this line is protected

app.use('/api/transactions', transactionRouter);
=======
app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);
>>>>>>> master

app.use(errorHandler);

module.exports = app;

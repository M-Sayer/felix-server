const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
<<<<<<< HEAD

const { NODE_ENV } = require('./config');
const usersRouter = require('./routes/usersRouter/usersRouter');
=======
const { NODE_ENV } = require('./config');
const transactionRouter = require('./routes/transactions/TransactionRouter');
const userRouter = require('./routes/user/user-router');
const errorHandler = require('./middleware/error-handler');
>>>>>>> 517ae2246a93257b47a3a491c1fbac6148a5d944


const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

<<<<<<< HEAD
=======
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

>>>>>>> 517ae2246a93257b47a3a491c1fbac6148a5d944
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter)

app.use('/user', userRouter); //register, login, and get user by id

app.use('/api/transaction' , transactionRouter );

app.use(errorHandler);

module.exports = app;
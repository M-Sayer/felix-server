const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const userRouter = require('./routes/user/user-router');
const publicRoute = require('./routes/test-router/publicroute');
const privateRoute = require('./routes/test-router/privateroute');
const { requireAuth } = require('./middleware/jwt-auth');
const errorHandler = require('./middleware/error-handler');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json()); // accept json requests

app.use('/user', userRouter); //register, login, and get user by id

app.use('/public', publicRoute); //test for unprotected endpoint
app.use(requireAuth); // every route below this line is protected
app.use('/private', privateRoute); //test for protected endpoint

app.use(errorHandler);

module.exports = app;

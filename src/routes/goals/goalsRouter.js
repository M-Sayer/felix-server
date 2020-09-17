const express = require('express');
const { requireAuth } = require('../../middleware/jwtAuth');
const goalsRouter = express.Router();

const {
 
} = require('./GoalsService');

const { convertToCents, convertTransactionsToDollars, convertToDollars } = require('../../helpers');

goalsRouter.all('/', requireAuth);

goalsRouter.get('/', async (req, res, next) => {
  
});

module.exports = transactionsRouter;


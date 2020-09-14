const express = require('express');
const TransactionsRouter = express.Router();
const { requireAuth } = require('../../middleware/jwtAuth');

// To make it consistent with how
// users-router is importing users-service
const {
  getUserDetails,
  getUserIncome,
  getUserExpenses,
  getSingleTransaction,
} = require('./transactionsService');

/**
 * @note might need a POST endpoint later
 * if added, .route('/') is needed
 **/

TransactionsRouter.all('/', requireAuth);

TransactionsRouter.get('/', async (req, res, next) => {
  const user_id = req.user.user_id;

  try {
    const income = await getUserIncome(req.app.get('db'), user_id); // Array of income objects
    const expenses = await getUserExpenses(req.app.get('db'), user_id); // Array of expense objects

    return res.json({ income, expenses });
  } catch (error) {
    next(error);
  }
});

TransactionsRouter.get('/:transactionType/:id', async (req, res, next) => {
  const { transactionType, id } = req.params;

  if (!['income', 'expenses'].includes(transactionType)) {
    return res.status(400).json({
      error: 'Invalid transaction type',
    });
  }

  for (const [key, prop] of Object.entries({ transactionType, id })) {
    if (!prop) {
      return res.status(400).json({
        error: `${key} seems to be missing from query params`,
      });
    }
  }

  try {
    const transaction = await getSingleTransaction(
      req.app.get('db'),
      transactionType,
      id
    );

    if (!transaction) {
      return res.status(400).json({
        error: 'Invalid transaction id',
      });
    }
    // Proposed alternative for creating transactionDetails object
    // const transactionDetails = {...transaction};
    // console.log(transactionDetails);

    const transactionDetails =
      transactionType === 'income'
        ? {
            id: transaction.id,
            name: transaction.name,
            date_created: transaction.date_created,
            amount: transaction.income_amount,
            subType: transaction.transaction_category,
          }
        : {
            id: transaction.id,
            name: transaction.name,
            date_created: transaction.date_created,
            amount: transaction.expense_amount,
            subType: transaction.expense_category,
          };
    return res.status(200).json(transactionDetails);
  } catch (e) {
    next(e);
  }
});

module.exports = TransactionsRouter;

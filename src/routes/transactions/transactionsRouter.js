const express = require('express');
const { requireAuth } = require('../../middleware/jwtAuth');
const transactionsRouter = express.Router();

const {
  getUserIncome,
  getUserExpenses,
  getSingleTransaction,
} = require('./TransactionsService');

/**
 * @note might need a POST endpoint later
 * if added, .route('/') is needed
 **/

transactionsRouter.all('/', requireAuth);

transactionsRouter.get('/', async (req, res, next) => {
  const user_id = req.userId;

  try {
    const income = await getUserIncome(req.app.get('db'), user_id); // Array of income objects
    const expenses = await getUserExpenses(req.app.get('db'), user_id); // Array of expense objects

    return res.json({ income, expenses });
  } catch (error) {
    next(error);
  }
});

transactionsRouter.get('/transactions/:type/:id', async (req, res, next) => {
  const { type, id } = req.params;

  if (!['income', 'expenses'].includes(type)) {
    return res.status(400).json({
      error: 'Invalid transaction type',
    });
  }

  for (const [key, prop] of Object.entries({ type, id })) {
    if (!prop) {
      return res.status(400).json({
        error: `${key} seems to be missing from query params`,
      });
    }
  }

  try {
    const transaction = await getSingleTransaction(
      req.app.get('db'),
      type,
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
      type === 'income'
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
    return res
    .status(200)
    .json(transactionDetails);
  } catch (e) {
    next(e);
  }
})
  .patch((req,res,next) => {
    const { type, id } = req.params;

    const {name, amount, category} = req.body; 

    if(!['income','expenses'].includes(type)) {
      return res
        .status(400)
        .json({
          error : 'Invalid transaction type'
        });
    }
    for(const [key, prop] of Object.entries({type, id})) {
      if(!prop) {
        return res
          .status(400)
          .json({
            error : `${key} seems to be missing from query params`
          });
      }
    }
    if(!name && !amount && !category){
      res.status(400).json({error : 'no content to be updated'});
    }

    const transObject  = type === 'income'
      ? {
        name,
        income_amount : amount,
        income_category : category
      }
      :{
        name, 
        expense_amount : amount,
        expense_category : category
      }
      ;

      
      
  


  });




module.exports = transactionsRouter;


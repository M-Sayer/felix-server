const express = require('express');
const { requireAuth } = require('../../middleware/jwtAuth');
const transactionsRouter = express.Router();

const {
  getUserIncome,
  getUserExpenses,
  getSingleTransaction,
  patchSingleTransaction,
} = require('./TransactionsService');

/**
 * @note might need a POST endpoint later
 * if added, .route('/') is needed
 **/

/**
 * @todo GAGE- might need to add error handling if the said user don't have 
 * any content to send
 */
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

transactionsRouter
  .route('/:type/:id')
  .all(checkIfTransactionExists)
  .get( async (req, res, next) => {
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

      const transactionDetails =
      type === 'income'
        ? {
          id: transaction.id,
          name: transaction.name,
          description : transaction.description,
          date_created: transaction.date_created,
          amount: transaction.income_amount,
          subType: transaction.transaction_category,
        }
        : {
          id: transaction.id,
          name: transaction.name,
          description : transaction.description,
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
  .patch(requireAuth, async (req,res,next) => {

    //Get params
    const { type, id } = req.params;

    //Get user id from auth header
    const userId = req.userId;

    //Get body content
    const {name, amount, category, description} = req.body;

    //Get the transaction we're trying to edit to compare user ids
    const singleTransaction = await getSingleTransaction(req.app.get('db'), type, id);

    //Checks if user making patch matches user id of the transaction
    if (singleTransaction.user_id !== userId) {
      return res
      .status(401)
      .json({
        error : singleTransaction
      });
    }

    //Checks if type is either income or expense
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
    //Checks if body content exists
    if(!name && !amount && !category){
      res.status(400).json({error : 'no content to be updated'});
    }

    /**
     * @todo so when the amount is different from that amount on db
     *  update the balance along with it.
     */

     //Create transaction object
    const transObject  = 
    type === 'income'
      ? {
        name,
        description,
        income_amount : amount,
        income_category : category
      }
      : {
        name,
        description, 
        expense_amount : amount,
        expense_category : category
      }
      ;
    //Insert the new transaction object into db
    patchSingleTransaction(
      res.app.get('db'),
      type,
      id,
      transObject
    )
      .then(() => res.status(204).end())
      .catch(next);
  });

  //Checks if transaction exists
  async function  checkIfTransactionExists(req,res,next) {
  try {
    const ExistingTransaction = await getSingleTransaction(
      req.app.get('db'),
      req.params.type,
      req.params.id
    );
    if(!ExistingTransaction){
      return res.status(400).json(
        {error : 'the id of the transaction doesn\'t exist'}
      );
    }
    next();
  }catch(error){
    next(error);
  }
}

module.exports = transactionsRouter;


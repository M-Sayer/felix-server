const express = require('express');
const { requireAuth } = require('../../middleware/jwtAuth');
const transactionsRouter = express.Router();

const {
  getUserIncome,
  getUserExpenses,
  getSingleTransaction,
  createTransaction,
  patchSingleTransaction,
} = require('./TransactionsService');
const TransactionsService = require('./TransactionsService');

/**
 * @note might need a POST endpoint later
 * if added, .route('/') is needed
 **/

/**
 * @todo GAGE- might need to add error handling if the said user don't have 
 * any content to send
 */

/**
  * 
  * @note GAGE- getting 400 ERROR on http://...../dashbored of client since it can't call 
  * "http://...../api/transactions/users"
  * users is not an endpoint here. 
  * 
  * 
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
  .all(checkIfTransactionExists, requireAuth)
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

      if (req.auth_id !== req.userId) {
        return res
          .status(401)
          .json({
            error : 'user in unauthorized to view this transaction'
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
          category: transaction.income_category,
        }
        : {
          id: transaction.id,
          name: transaction.name,
          description : transaction.description,
          date_created: transaction.date_created,
          amount: transaction.expense_amount,
          category: transaction.expense_category,
        };
      return res
        .status(200)
        .json(transactionDetails);
    } catch (e) {
      next(e);
    }
  })
  .patch( async (req,res,next) => {

    //Get params
    const { type, id } = req.params;


    //Get body content
    const {name, amount, category, description} = req.body;

    //Checks if user making patch matches user id of the transaction
    if (req.auth_id !== req.userId) {
      return res
        .status(401)
        .json({
          error : 'user in unauthorized to view this transaction'
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
  })
  .delete( (res,req,next) =>{
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

    if (req.auth_id !== req.userId) {
      return res
        .status(401)
        .json({
          error : 'user in unauthorized to view this transaction'
        });
    }

    TransactionsService.deleteTransaction(
      req.app.get('db'),
      type,
      id
    )
      .then(res.status(204).end())
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
    //should be === w/ req.userId from auth
    req.auth_id = ExistingTransaction.user_id;
    next();
  }catch(error){
    next(error);
  }
}





//Creates new transaction of either income or expenses type
transactionsRouter.route('/create').post(requireAuth ,async (req, res, next) => {

  //Get all body values, type must be a string of either 'income' or 'expenses'.
  //This should be sent from client-side ether by selecting from a type dropdown, or using two completely different views for transaction creation
  const { name, description, amount, category, type } = req.body;

  //Get user id from jwt
  const user_id = req.userId;

  //Transaction object for inserting
  let newTransaction = {};

  //Response to client
  let response = {};

  //If type is income, transaction object has income_amount and income_category properties
  if (type === 'income') {

    //If the amount if less than or equal to 0 reject it
    if (amount <= 0) {
      return res.status(400).json({error: 'Income amount must be greater than 0'});
    }

    //If the category type doesn't match income table enums reject it
    if (category !== 'paycheck' && category !== 'freelance' && category !== 'side_gig' && category !== 'other') {
      return res.status(400).json({error: 'category does not exist for income'});
    }

    //Build the response object
    response = { type: 'income' };

    //Build the new transaction object
    newTransaction = {
      user_id: user_id,
      name,
      description,
      income_amount: amount,
      income_category: category,
    };
  }

  //If type is expenses, transaction object has expense_amount and expense_category properties
  else if (type === 'expenses') {

    //If the amount if greater than or equal to 0 reject it
    if (amount >= 0) {
      return res.status(400).json({error: 'Expense amount must be less than 0'});
    }

    //If the category type doesn't match expenses table enums reject it
    if (category !== 'bills' && category !== 'transportation' && category !== 'food' && category !== 'entertainment' && category !== 'other') {
      return res.status(400).json({error: 'category does not exist for expenses'});
    }

    //Build the response object
    response = { type: 'expenses' };

    //Build the new transaction object
    newTransaction = {
      user_id: user_id,
      name,
      description,
      expense_amount: amount,
      expense_category: category,
    };
  }

  //If type is neither expenses or income reject it
  else if (type !== 'income' || type !== 'expenses') {
    return res.status(400).json({error: 'Transaction must be type "income" or "expenses"'});
  }

  //Create the transaction and insert it into the db, the 'type' parameter informs knex which db table to insert into
  try {
    await createTransaction(
      req.app.get('db'),
      type,
      newTransaction);
    
    //Respond with object {type: "income"/"expenses"}
    return res.status(201).json({});

  } catch (e) {
    next(e);
  }

});

module.exports = transactionsRouter;


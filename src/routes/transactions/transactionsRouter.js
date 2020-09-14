const express = require('express');

const transactionsRouter = express.Router();

const TransactionsService = require('./TransactionsService');

/**
 * @note might need a POST endpoint later
 *        if added the .route('/') is needed 
 */
transactionsRouter
  .get('/', async(req, res, next) => {
    // const user_id = req.user.user_id;
    const user_id = 1; // Temp
    
    try {
      const income = await TransactionsService.getUserIncome(req.app.get('db'), user_id); // Array of income objects
      const expenses = await TransactionsService.getUserExpense(req.app.get('db'), user_id); // Array of expense objects
      // No need to sort, already in chronological order
      console.log({income, expenses});
      res.json({income, expenses});
    }
    catch(error) {
      next(error);
    }
  });

transactionsRouter
  .get('/transactions/:type/:id', async (req,res,next) => {
    
    const {transactionType, id} = req.params;

    if(!['income','expenses'].includes(transactionType)){
      return res.status(400).json({error : 'invalid transaction type'});
    }

    for(const [key,prop] of Object.entries({transactionType, id})){
      if(!prop){
        return res.status(400).json({error : `${key} seems to be missing from quarry params`});
      }
    }
    try{
      const transaction = await TransactionsService.getSingleTransaction(
        req.app.get('db'),
        transactionType,
        id,
      );

      if(!transaction){
        return res.status(400).json({error : 'invalid transaction id'});
      }

      const transactionDetails =
        transactionType === 'income' 
          ? {
            id : transaction.id,
            name : transaction.name,
            date_created : transaction.date_created,
            amount : transaction.income_amount,
            subType : transaction.transaction_category
          }
          :{
            id : transaction.id,
            name : transaction.name,
            date_created : transaction.date_created,
            amount : transaction.expense_amount,
            subType : transaction.expense_category
          }
          ;
          
      res.status(200).json(transactionDetails);
    }catch(e){
      next(e);
    }
  });




module.exports = transactionsRouter;

const express = require('express');

const transactionRouter = express.Router();

const TransactionServices = require('./TransactionServices');


transactionRouter
  .get('/:transactionType/:id', async (req,res,next) => {
    
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
      const transaction = await TransactionServices.getSingleTransaction(
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




module.exports = transactionRouter;

const express = require('express');

const transactionRouter = express.Router();

const TransactionServices = require('./TransactionServices');


transactionRouter
/**
 * needs to get a single transaction based on it's id
 * 
 * 1 : found out wether it's trying to quarry ether income or expenses table
 * 
 * 2: us the quarry value (id of _____) to quarry need table WHERE id=${quarry_value}
 */
  .get('/:transactionType/:id', async  (req,res,next) => {
    
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
      const  transaction = await TransactionServices.getSingleTransaction(
        req.app.get('db'),
        transactionType,
        id,
      );

      res.status(200).json(transaction);
    }catch(e){
      next(e);
    }


  });




module.exports = transactionRouter;

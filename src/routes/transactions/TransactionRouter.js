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

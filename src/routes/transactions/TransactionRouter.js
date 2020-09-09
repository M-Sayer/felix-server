const express = require('express');

const TransactionRouter = express.Router();

const TransactionServices = require('./TransactionServices');

/**
 * expects something like [
 *         {
 *          income:{
 *               val : 123456,
 *               type: 'foo',
 *              } 
 *          }, 
 *          {
 *          income:{
 *               val : 123456,
 *               type: 'foo',
 *              } 
 *          }, 
 *          {
 *          expense:{
 *               val : 123456,
 *               type: 'foo',
 *              } 
 *          },
 *           {
 *          income:{
 *               val : 123456,
 *               type: 'foo',
 *              } 
 *          },
 *           {
 *          expense:{
 *               val : 123456,
 *               type: 'foo',
 *              } 
 *          },
 *           {
 *          expense:{
 *               val : 123456,
 *               type: 'foo',
 *              } 
 * }....]
 */

TransactionRouter
.get('/',(req,res,next) =>{

});




module.exports = TransactionRouter;

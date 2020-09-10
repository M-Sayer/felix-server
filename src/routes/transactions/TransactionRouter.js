const express = require('express');

const TransactionRouter = express.Router();

const TransactionServices = require('./TransactionServices');

/**
 * expects something like [
 *         {
 *          income:{
 *               name : 'foo',
 *               val : 123456,
 *               type: 'bar'
 *               date_created : '2020:06:15 : 12:45:51'
 *              } 
 *          }, 
 *          {
 *          income:{
 *               name : 'foo',
 *               val : 123456,
 *               type: 'bar'
 *               date_created : '2020:06:15 : 12:45:51'
 *              } 
 *          }, 
 *          {
 *          expense:{
 *               name : 'foo',
 *               val : 123456,
 *               type: 'bar'
 *               date_created : '2020:06:15 : 12:45:51'
 *              } 
 *          },
 *           {
 *          income:{
 *               name : 'foo',
 *               val : 123456,
 *               type: 'bar'
 *               date_created : '2020:06:15 : 12:45:51'
 *              } 
 *          },
 *           {
 *          expense:{
 *               name : 'foo',
 *               val : 123456,
 *               type: 'bar'
 *               date_created : '2020:06:15 : 12:45:51'
 *              } 
 *          },
 *           {
 *          expense:{
 *               name : 'foo',
 *               val : 123456,
 *               type: 'bar'
 *               date_created : '2020:06:15 : 12:45:51'
 *              } 
 * }....]
 */

TransactionRouter
.get('/',(req,res,next) =>{

});




module.exports = TransactionRouter;

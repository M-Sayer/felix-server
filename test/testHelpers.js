const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



/**
 * make a knex instance for postgres
 * @returns { db }
 */
const makeKnexInstance = () =>{
  return knex({
    client : 'pg',
    connection: process.env.DATABASE_URL,
  });
};


const makeTestUsers = () => {

};

const makeIncomeAndExpensesArray = () => {
  const income = [
    {
      id: 1,
      user_id: 1,
      incomeAmount: 113.88,
      name : 'test 1',
      transaction_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 2,
      user_id: 1,
      incomeAmount: 20.99,
      name : 'test 2',
      transaction_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 3,
      user_id: 2,
      incomeAmount: 77.21,
      name : 'test 3',
      transaction_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 4,
      user_id: 1,
      incomeAmount: 654.12,
      name : 'test 4',
      transaction_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 5,
      user_id: 3,
      incomeAmount: .99,
      name : 'test 5',
      transaction_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    }
  ];
  const expenses = [
    {
      id: 1,
      user_id: 1,
      expense_amount: -12.12,
      name : 'test 1',
      expense_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 2,
      user_id: 1,
      expense_amount: -50.11,
      name : 'test 2',
      expense_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 3,
      user_id: 3,
      expense_amount: -.12,
      name : 'test 3',
      expense_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 4,
      user_id: 2,
      expense_amount: -7541.46,
      name : 'test 4',
      expense_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 5,
      user_id: 1,
      expense_amount: -708.81,
      name : 'test 5',
      expense_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 6,
      user_id: 3,
      expense_amount: -43.74,
      name : 'test 6',
      expense_category : 'other',
      dateCreated :  '2029-01-22T16:28:32.615Z'  
    }
  ];

  return {income, expenses};
};

const seedIncomeAndExpensesTables = () =>{

};



module.exports = {
  makeKnexInstance,
  makeIncomeAndExpensesArray,
};


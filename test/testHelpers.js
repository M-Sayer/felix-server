/* eslint-disable quotes */
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

/**
 * @todo "needs to be made with __auth__ in mind"
 */
const makeTestUsersArray = () => {

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


/**
 * @todo needs to be made taking content generated from makeTestUsersArray()
 *        and seed knex instance.
 */
const seedUsersTable = (db,users) => {

};

/**
 * @todo needs seedUsersTable() to continue @ -> gage when ready
 */
const  seedIncomeAndExpensesTables = (db, users, income=[] , expenses=[] ) => {
  seedUsersTable(db, users);

  db.transaction(async trx => {
    await trx.into('income').insert(income);
    await trx.into('expenses').insert(expenses);
    
    await trx.raw(
      `SELECT setval('income_id_seq', ?)`,
      [income[income.length - 1].id]
    );
    await trx.raw(
      `SELECT setval('expenses_id_seq', ?)`,
      [expenses[expenses.length - 1].id]
    );
  });
};

const clearTables = (db) => {
  return db.transaction(trx =>{
    trx.raw(
      `TRUNCATE
          users,
          income,
          expenses,
          goals;`
    )
      .then(()=> 
        Promise.all([

          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE income_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE expenses_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE goals_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq',0)`),
          trx.raw(`SELECT setval('income_id_seq',0)`),
          trx.raw(`SELECT setval('expenses_id_seq',0)`),
          trx.raw(`SELECT setval('goals_id_seq',0)`),
        ])
      );
  });
};



module.exports = {
  makeKnexInstance,
  makeIncomeAndExpensesArray,
  seedIncomeAndExpensesTables,
  clearTables,
};


/* eslint-disable quotes */
require('dotenv').config();
const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



/**
 * make a knex instance for postgres
 * @returns { db }
 */

const makeKnexInstance = () => {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
};

const makeAuthHeader = (user, secret = process.env.JWT_SECRET) => {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
};

/**
 * @todo "needs to be made with __auth__ in mind"
 */
const makeTestUsersArray = () => {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      first_name: 'Test name 1',
      last_name: 'Test Lname 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      allowance: 3333.33,
      balance: 9999.99,
    },
    {
      id: 2,
      user_name: 'test-user-2',
      first_name: 'Test name 2',
      last_name: 'Test Lname 2',
      password: 'password',
      date_created: new Date('2029-02-22T16:28:32.615Z'),
      allowance: 4444.44,
      balance: 8888.88,
    },
    {
      id: 3,
      user_name: 'test-user-3',
      first_name: 'Test name 3',
      last_name: 'Test Lname 3',
      password: 'password',
      date_created: new Date('2029-03-22T16:28:32.615Z'),
      allowance: 5555.55,
      balance: 7777.77,
    },
    {
      id: 4,
      user_name: 'test-user-4',
      first_name: 'Test name 4',
      last_name: 'Test Lname 4',
      password: 'password',
      date_created: new Date('2029-04-22T16:28:32.615Z'),
      allowance: 6666.66,
      balance: 6666.66,
    },
    {
      id: 5,
      user_name: 'test-user-5',
      first_name: 'Test name 5',
      last_name: 'Test Lname 5',
      password: 'password',
      date_created: new Date('2029-05-22T16:28:32.615Z'),
      allowance: 7777.77,
      balance: 5555.55,
    },
    {
      id: 6,
      user_name: 'test-user-6',
      first_name: 'Test name 6',
      last_name: 'Test Lname 6',
      password: 'password',
      date_created: new Date('2029-06-22T16:28:32.615Z'),
      allowance: 8888.88,
      balance: 4444.44,
    },
  ];
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

const seedUsersTable = (db, users) => {
  const testUsersArray = makeTestUsersArray();
  return db.transaction(async (trx) => {
    await trx.into('users').insert(testUsersArray);
  });

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

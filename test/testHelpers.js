/* eslint-disable quotes */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('knex');

const makeKnexInstance = () => {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  });
}

const makeAuthHeader = (user, secret = process.env.JWT_SECRET) => {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
}

const makeUsersArray = () => {
  return [
    {
      id: 1,
      username: 'test-user-1',
      email: 'testmail@test.test',
      first_name: 'Test First Name 1',
      last_name: 'Test Last Name 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      allowance: 3333,
      balance: 9999,
    },
    {
      id: 2,
      username: 'test-user-2',
      email: 'testmail@test.test',
      first_name: 'Test First Name 2',
      last_name: 'Test Last Name 2',
      password: 'password',
      date_created: new Date('2029-02-22T16:28:32.615Z'),
      allowance: 4444,
      balance: 8888,
    },
    {
      id: 3,
      username: 'test-user-3',
      email: 'testmail@test.test',
      first_name: 'Test First Name 3',
      last_name: 'Test Last Name 3',
      password: 'password',
      date_created: new Date('2029-03-22T16:28:32.615Z'),
      allowance: 5555,
      balance: 7777,
    },
    {
      id: 4,
      username: 'test-user-4',
      email: 'testmail@test.test',
      first_name: 'Test First Name 4',
      last_name: 'Test Last Name 4',
      password: 'password',
      date_created: new Date('2029-04-22T16:28:32.615Z'),
      allowance: 6666,
      balance: 6666,
    },
    {
      id: 5,
      username: 'test-user-5',
      email: 'testmail@test.test',
      first_name: 'Test First Name 5',
      last_name: 'Test Last Name 5',
      password: 'password',
      date_created: new Date('2029-05-22T16:28:32.615Z'),
      allowance: 7777,
      balance: 5555,
    },
    {
      id: 6,
      username: 'test-user-6',
      email: 'testmail@test.test',
      first_name: 'Test First Name 6',
      last_name: 'Test Last Name 6',
      password: 'password',
      date_created: new Date('2029-06-22T16:28:32.615Z'),
      allowance: 8888,
      balance: 4444,
    },
  ];
}

const makeIncomeAndExpensesArray = () => {
  const testIncome = [
    {
      id: 1,
      name: 'Test Income 1',
      user_id: 1,
      income_amount: 11113,
      income_category : 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 2,
      name: 'Test Income 2',
      user_id: 1,
      income_amount: 2000,
      income_category : 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 3,
      name: 'Test Income 3',
      user_id: 2,
      income_amount: 7777,
      income_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 4,
      name: 'Test Income 4',
      user_id: 1,
      income_amount: 65412,
      income_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 5,
      name: 'Test Income 5',
      user_id: 3,
      income_amount: 99,
      income_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    }
  ];
  const testExpenses = [
    {
      id: 1,
      name: 'Test Expense 1',
      user_id: 1,
      expense_amount: -1212,
      expense_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 2,
      name: 'Test Expense 2',
      user_id: 1,
      expense_amount: -5011,
      expense_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 3,
      name: 'Test Expense 3',
      user_id: 3,
      expense_amount: -12,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 4,
      name: 'Test Expense 4',
      user_id: 2,
      expense_amount: -754146,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 5,
      name: 'Test Expense 5',
      user_id: 1,
      expense_amount: -70881,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 6,
      name: 'Test Expense 6',
      user_id: 3,
      expense_amount: -4374,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    }
  ];
  return {testIncome, testExpenses}; 
}

const makeTransactionReply = (type, tran) => {
    tran.description = !tran.description ? null : tran.description ; 
    
    return type === 'income' 
    ? {
      id: tran.id,
      name: tran.name,
      description : tran.description,
      date_created: tran.date_created,
      amount: (tran.income_amount / 100),
      category: tran.income_category,
    }
    : {
      id: tran.id,
      name: tran.name,
      description : tran.description,
      date_created: tran.date_created,
      amount: (tran.expense_amount / 100),
      category: tran.expense_category,
    };
}

const makeGoalsArray = () => {
  return [
    {
      id: 1,
      name: 'Test Goal 1',
      user_id: 1,
      goal_amount: 400.00,
      contribution_amount: 100.00,
      current_amount: 100.00,
      end_date: new Date('2020-10-15T13:26:19.359Z'),
      completed: false,
      date_created: new Date('2020-09-15T13:26:19.359Z'),
    },
    {
      id: 2,
      name: 'Test Goal 2',
      user_id: 1,
      goal_amount: 400.00,
      contribution_amount: 100.00,
      current_amount: 100.00,
      end_date: new Date('2020-10-15T13:26:19.359Z'),
      completed: false,
      date_created: new Date('2020-09-15T13:26:19.359Z'),
    },
  ];
}

const makeAllFixtures = () => {
  const testUsers = makeUsersArray();
  const { income: testIncome, expenses: testExpenses } = makeIncomeAndExpensesArray();
  const testGoals = makeGoalsArray();

  return {
    testUsers,
    testIncome,
    testExpenses,
    testGoals,
  }
}

const seedUsersTable =(db, users) => {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  return db.into('users').insert(preppedUsers)
  .then(()=>
    db.raw(
     `SELECT setval('users_id_seq', ?)`,
     [users[users.length - 1].id],
   )
  );
}

const seedIncomeAndExpensesTables = (db, users, income = [] , expenses = [] ) => {
  return db.transaction(async trx => {
    await trx.into('users').insert(users);
    await trx.into('income').insert(income);
    await trx.into('expenses').insert(expenses);
    
    await trx
      .raw(
        `SELECT setval('income_id_seq', ?)`,
        income[income.length - 1].id
      );

    await trx
      .raw(
        `SELECT setval('expenses_id_seq', ?)`,
        expenses[expenses.length - 1].id
      );
  });
}

const seedGoalsTable = (db, users, goals = []) => {
  return db.transaction(async trx => {
    await trx('users').insert(users);
    await trx('goals').insert(goals);
  });
}

const seedAllTables = (db, users, income = [], expenses = [], goals = []) => {
  return db.transaction(async trx => {
    await trx('users').insert(users);
    await trx('income').insert(income);
    await trx('expenses').insert(expenses);
    await trx('goals').insert(goals);

    await trx
      .raw(
        `SELECT setval(users_id_seq, ?)`,
        users[users.length-1].id
      );

    await trx
      .raw(
        `SELECT setval(income_id_seq, ?)`,
        income[income.length-1].id
      );

    await trx
      .raw(
        `SELECT setval(expenses_id_seq, ?)`,
        expenses[expenses.length-1].id
      );
    
    await trx
      .raw(
        `SELECT setval(goals_id_seq, ?)`,
        goals[goals.length-1].id
      );

  })
}

const clearAllTables = (db) => {
  return db.transaction(trx => {
     return trx.raw(
      `TRUNCATE 
      "alerts",
      "expenses",
      "income",
      "goals",
      "users"
      RESTART IDENTITY CASCADE`
    )
      .then(() => 
        Promise
          .all([
            trx.raw(`ALTER SEQUENCE income_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE expenses_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE alerts_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE goals_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('income_id_seq', 0)`),
            trx.raw(`SELECT setval('alerts_id_seq', 0)`),
            trx.raw(`SELECT setval('expenses_id_seq', 0)`),
            trx.raw(`SELECT setval('goals_id_seq', 0)`),
            trx.raw(`SELECT setval('users_id_seq', 0)`),
        ])
      );
  });
}

module.exports = {
  clearAllTables,
  makeAuthHeader,
  makeAllFixtures,
  makeIncomeAndExpensesArray,
  makeKnexInstance,
  makeTransactionReply,
  makeUsersArray,
  makeGoalsArray,
  seedUsersTable,
  seedIncomeAndExpensesTables,
  seedGoalsTable,
  seedAllTables,
};

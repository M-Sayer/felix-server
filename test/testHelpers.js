/* eslint-disable quotes */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      user_name: 'test-user-1',
      first_name: 'Test First Name 1',
      last_name: 'Test Last Name 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      allowance: 3333.33,
      balance: 9999.99,
    },
    {
      id: 2,
      user_name: 'test-user-2',
      first_name: 'Test First Name 2',
      last_name: 'Test Last Name 2',
      password: 'password',
      date_created: new Date('2029-02-22T16:28:32.615Z'),
      allowance: 4444.44,
      balance: 8888.88,
    },
    {
      id: 3,
      user_name: 'test-user-3',
      first_name: 'Test First Name 3',
      last_name: 'Test Last Name 3',
      password: 'password',
      date_created: new Date('2029-03-22T16:28:32.615Z'),
      allowance: 5555.55,
      balance: 7777.77,
    },
    {
      id: 4,
      user_name: 'test-user-4',
      first_name: 'Test First Name 4',
      last_name: 'Test Last Name 4',
      password: 'password',
      date_created: new Date('2029-04-22T16:28:32.615Z'),
      allowance: 6666.66,
      balance: 6666.66,
    },
    {
      id: 5,
      user_name: 'test-user-5',
      first_name: 'Test First Name 5',
      last_name: 'Test Last Name 5',
      password: 'password',
      date_created: new Date('2029-05-22T16:28:32.615Z'),
      allowance: 7777.77,
      balance: 5555.55,
    },
    {
      id: 6,
      user_name: 'test-user-6',
      first_name: 'Test First Name 6',
      last_name: 'Test Last Name 6',
      password: 'password',
      date_created: new Date('2029-06-22T16:28:32.615Z'),
      allowance: 8888.88,
      balance: 4444.44,
    },
  ];
}

const makeIncomeAndExpensesArray = () => {
  const income = [
    {
      id: 1,
      name: 'Test Income 1',
      user_id: 1,
      income_amount: 113.88,
      income_category : 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 2,
      name: 'Test Income 2',
      user_id: 1,
      income_amount: 20.99,
      income_category : 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 3,
      name: 'Test Income 3',
      user_id: 2,
      income_amount: 77.21,
      income_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 4,
      name: 'Test Income 4',
      user_id: 1,
      income_amount: 654.12,
      income_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 5,
      name: 'Test Income 5',
      user_id: 3,
      income_amount: .99,
      income_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    }
  ];
  const expenses = [
    {
      id: 1,
      name: 'Test Expense 1',
      user_id: 1,
      expense_amount: -12.12,
      expense_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 2,
      name: 'Test Expense 2',
      user_id: 1,
      expense_amount: -50.11,
      expense_category: 'other',
      date_created: '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 3,
      name: 'Test Expense 3',
      user_id: 3,
      expense_amount: -.12,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 4,
      name: 'Test Expense 4',
      user_id: 2,
      expense_amount: -7541.46,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 5,
      name: 'Test Expense 5',
      user_id: 1,
      expense_amount: -708.81,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    },
    {
      id: 6,
      name: 'Test Expense 6',
      user_id: 3,
      expense_amount: -43.74,
      expense_category : 'other',
      date_created : '2029-01-22T16:28:32.615Z'  
    }
  ];

  return {income, expenses};
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

const seedUsersTable = async (db, users) => {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  await db('users')
    .insert(preppedUsers);

  await db
    .raw(
      `SELECT setval('users_id_seq', ?)`,
      users[users.length-1].user_id
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
    trx.raw(
      `TRUNCATE
          users,
          income,
          expenses,
          goals;
          `
    )
      .then(() => 
        Promise
          .all([
            trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE income_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE expenses_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE goals_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('users_id_seq', 0)`),
            trx.raw(`SELECT setval('income_id_seq', 0)`),
            trx.raw(`SELECT setval('expenses_id_seq', 0)`),
            trx.raw(`SELECT setval('goals_id_seq', 0)`),
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
  makeUsersArray,
  makeGoalsArray,
  seedUsersTable,
  seedIncomeAndExpensesTables,
  seedGoalsTable,
  seedAllTables,
};

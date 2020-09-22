/* eslint-disable quotes */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('knex');
const moment = require ('moment');
const { convertToDollars } = require('../src/helpers');

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
      first_name: 'Test First Name 1',
      last_name: 'Test Last Name 1',
      email: 'test-user-email-1@email.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      allowance: 3333,
      balance: 9999,
    },
    {
      id: 2,
      username: 'test-user-2',
      first_name: 'Test First Name 2',
      last_name: 'Test Last Name 2',
      email: 'test-user-email-2@email.com',
      password: 'password',
      date_created: new Date('2029-02-22T16:28:32.615Z'),
      allowance: 4444,
      balance: 8888,
    },
    {
      id: 3,
      username: 'test-user-3',
      first_name: 'Test First Name 3',
      last_name: 'Test Last Name 3',
      email: 'test-user-email-3@email.com',
      password: 'password',
      date_created: new Date('2029-03-22T16:28:32.615Z'),
      allowance: 5555,
      balance: 7777,
    },
    {
      id: 4,
      username: 'test-user-4',
      first_name: 'Test First Name 4',
      last_name: 'Test Last Name 4',
      email: 'test-user-email-4@email.com',
      password: 'password',
      date_created: new Date('2029-04-22T16:28:32.615Z'),
      allowance: 6666,
      balance: 6666,
    },
    {
      id: 5,
      username: 'test-user-5',
      first_name: 'Test First Name 5',
      last_name: 'Test Last Name 5',
      email: 'test-user-email-5@email.com',
      password: 'password',
      date_created: new Date('2029-05-22T16:28:32.615Z'),
      allowance: 7777,
      balance: 5555,
    },
    {
      id: 6,
      username: 'test-user-6',
      first_name: 'Test First Name 6',
      last_name: 'Test Last Name 6',
      email: 'test-user-email-6@email.com',
      password: 'password',
      date_created: new Date('2029-06-22T16:28:32.615Z'),
      allowance: 8888,
      balance: 4444,
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
      goal_amount: 40000, // In cents
      contribution_amount: 10000,
      current_amount: 10000,
      end_date: moment(new Date('2020-10-15T13:26:19.359Z')),
      completed: false,
    },
    {
      id: 2,
      name: 'Test Goal 2',
      user_id: 1,
      goal_amount: 40000, // In cents
      contribution_amount: 10000,
      current_amount: 10000,
      end_date: moment(new Date('2020-10-15T13:26:19.359Z')),
      completed: false,
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
      users[users.length-1].id
    );
}

const seedIncomeAndExpensesTables = (db, users, income = [] , expenses = [] ) => {
  return db.transaction(async trx => {
    await trx.into('users').insert(insert);
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

const seedGoalsTable = (db, goals = []) => {
  return db.transaction(async trx => {
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
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
          goals,
          income,
          expenses,
          users
          RESTART IDENTITY CASCADE;`
    )
  );
}

const convertTestGoal = (goal) => ({
  ...goal,
  goal_amount: convertToDollars(goal.goal_amount),
  current_amount: convertToDollars(goal.current_amount),
  contribution_amount: convertToDollars(goal.contribution_amount),
  end_date: moment(goal.end_date).format(),
  date_created: new Date().toLocaleString(),
});

const convertTestGoals = (goals) =>
  goals.map(goal => convertTestGoal(goal));

module.exports = {
  makeKnexInstance,
  makeAuthHeader,
  makeUsersArray,
  makeIncomeAndExpensesArray,
  makeGoalsArray,
  makeAllFixtures,
  seedUsersTable,
  seedIncomeAndExpensesTables,
  seedGoalsTable,
  seedAllTables,
  clearAllTables,
  convertTestGoal,
  convertTestGoals,
};

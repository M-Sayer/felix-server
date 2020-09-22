/* eslint-disable quotes */
const app = require('../src/app');
const helper = require('./testHelpers');
const supertest = require('supertest');


describe('Transaction Endpoint', ()=> {
  let db;

  const {
    testIncome,
    testExpenses
  } = helper.makeIncomeAndExpensesArray();

  const testUsers = helper.makeUsersArray();

  before('make knex instance', () =>{
    db = helper.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helper.clearAllTables(db));

  afterEach('cleanup', () => helper.clearAllTables(db));


  describe(`GET '/' endpoint` , () =>{
    context(`if do`, ()=>{
      it(`then this should`, () => {

      });
    });
  });
  describe(`POST '/' endpoint` , () =>{
    context(`if do`, ()=>{
      it(`then this should`, () => {

      });
    });
  });

  describe.only(`GET "/api/transaction/singles" endpoint`, () => {
    
    beforeEach('insert transactions into tables', () =>{
      helper.seedIncomeAndExpensesTables(
        db,
        testUsers,
        testIncome,
        testExpenses
      );
    });
    
    context('if given a vailed auth, and a valid id, and a type of "income"', ()=> {

      const transaction_id = 2;
      const type = 'income';

      beforeEach('insert transactions into tables', () =>{
        helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      it('should give a 200, and send back _income_ info',()=>{

        const expectedIncome = helper.makeTransactionReply( type ,testIncome[ transaction_id - 1 ]);

        return supertest(app)
          .get(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .expect(200, expectedIncome); 
      });

    });

    context('if given a vialed auth, and a valid id, and a type of "expenses"', ()=> {

      const transaction_id = 2;
      const type = 'expenses';

      beforeEach('insert transactions into tables', () =>{
        helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      it('should give a 200, and send back _expenses_ info',()=>{
        
        const expectedExpense = helper.makeTransactionReply( type ,testExpenses[ transaction_id - 1 ]);

        return supertest(app)
          .get(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .expect(200, expectedExpense); 
      });

    } );

    // context('if NOT given auth, and a valid id ', ()=> {

    //   it('should give a 400,and send back error message, from income',()=>{

    //   });

    //   it('should give a 400,and send back error message, from expenses',()=>{

    //   });

    // } );

    // context('if given auth, and a IN-valid id ', ()=> {

    //   it('should give a 400,and an error message from income request',()=>{

    //   });

    //   it('should give a 400,and an error message from expenses request',()=>{

    //   });

    // } );
  } );


  




});
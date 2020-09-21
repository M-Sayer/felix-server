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

  const testUsers = helper.makeTestUsersArray();

  before('make knex instance', () =>{
    db = helper.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helper.clearTables(db));

  afterEach('cleanup', () => helper.clearTables(db));


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
    
    context('if given auth, and a valid id', ()=> {

      const transaction_id = 2;

      it('should give a 200, and send back income info',()=>{
        const type = 'income';

        const expectedIncome = testIncome[ transaction_id - 1 ];

        return supertest(app)
          .get(`/api/transaction/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .expect(200, expectedIncome); 
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
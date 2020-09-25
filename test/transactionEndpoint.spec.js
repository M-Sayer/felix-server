/* eslint-disable quotes */
const app = require('../src/app');
const helper = require('./testHelpers');
const supertest = require('supertest');



describe.only('Transaction Endpoint', ()=> {
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

    context(`if this is content in the database, the user has an auth token, and it's tied to that user`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

      it(`send back a 201, and a object with array of income, and expenses`, () => {

        const expectedObject = helper.makeExpectedIncomeExpensesArray(testIncome, testExpenses, testUsers[0].id) 

        return supertest(app)
        .get('/api/transactions')
        .set('Authorization', helper.makeAuthHeader(testUsers[0]))
        .expect(200, expectedObject)

      });
    });

    context(`If the user doesn't have auth`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

      it(`it should send back a 401`, () => {

        return supertest(app)
        .get('/api/transactions')
        .expect(401)

      });
    });

    context(`If the user Has No testIncome, or Expenses`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedUsersTable(
          db,
          testUsers,
          );
        });

      it(`send back a 201, and 2 empty arrays `, () => {

        const expectedObject = {income :[], expenses : []}; 

        return supertest(app)
        .get('/api/transactions')
        .set('Authorization', helper.makeAuthHeader(testUsers[0]))
        .expect(200, expectedObject)

      });
    });
    
    context(`If the user only has Income`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          );
        });

      it(`send back a 201, and income and expense array witch would be empty`, () => {

        console.log(testUsers[0].id)

        const expectedObject = helper.makeExpectedIncomeExpensesArray(testIncome, [], testUsers[0].id) 

        return supertest(app)
        .get('/api/transactions')
        .set('Authorization', helper.makeAuthHeader(testUsers[0]))
        .expect(200, expectedObject)

      });
    });

  });

  describe(`POST '/' endpoint` , () =>{

    context(`if user has auth, and is sending the correct content for _income_`, ()=>{
        
      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const type = 'income';

      it(`should send back a 201, and have that content in the __income__ database`, () => {

        const newIncome = {
            name: 'NEW Test Income',
            description : 'NEW test',
            amount: 11113,
            category : 'other',
            type, 
        }

    
        return supertest(app)
        .post('/api/transactions')
        .set('Authorization', helper.makeAuthHeader(testUsers[0]))
        .send(newIncome)
        .expect(201)
        .expect( () =>
          supertest(app)
          .get(`/api/transactions/${type}/${testIncome.length}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .expect(200, newIncome)
        )
      });
    });

    context(`if user has auth, and is sending the correct content for _expenses_`, ()=>{
        
      beforeEach('insert transactions into tables', () =>{

        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const type = 'expenses'

        it(`should send back a 201, and have that content in the __income__ database`, () => {

          const newExpense = {
              name: 'NEW Test Income',
              description : 'NEW test',
              amount: -13,
              category : 'other',
              type, 
          }
  
      
          return supertest(app)
          .post('/api/transactions')
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .send(newExpense)
          .expect(201)
          .expect( () =>
            supertest(app)
            .get(`/api/transactions/${type}/${testExpenses.length}`)
            .set('Authorization', helper.makeAuthHeader(testUsers[0]))
            .expect(200, newExpense)
          )
        });
    });

    context(`if the user lacks Auth`, ()=>{
        
      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const type = 'income';

      it(`it should send back a 401`, () => {

        const newIncome = {
            name: 'NEW Test Income',
            description : 'NEW test',
            amount: 11113,
            category : 'other',
            type, 
        }

    
        return supertest(app)
        .post('/api/transactions')
        .send(newIncome)
        .expect(401)

      });
    });

    context.skip(`if there is missing fields in the post body `, ()=>{
        
      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const type = 'income';

        const fieldArry = ['name', 'amount', 'category', 'type']; 

        const newIncome = {
            name: 'NEW Test Income',
            amount: 11113,
            category : 'other',
            type, 
        }
        for(let key of fieldArry){
          it(`should send back a 400 stating ${key} is missing`, () => {
            delete newIncome[key]
        
            return supertest(app)
            .post('/api/transactions')
            .set('Authorization', helper.makeAuthHeader(testUsers[0]))
            .send(newIncome)
            .expect(400)
          });
        }
    });

  });

  describe(`GET "/api/transaction/:type/:id" endpoint`, () => {
    
    
    context('if given a valid auth, and a valid id, and a type of "income"', ()=> {

      const transaction_id = 2;
      const type = 'income';

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
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
        return helper.seedIncomeAndExpensesTables(
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
    });

    context(`if there are xss attacks being installed for _income_ `, ()=>{
      
      const testUser = helper.makeUsersArray()[1]

      const {maliciousIncome, expectedIncome} = helper.makeMaliciousIncome(testUser.id)

      const type = 'income';

      beforeEach('insert malicious transactions into tables', () =>{
       return helper.seedMaliciousTransaction(
          db,
          testUser,
          maliciousIncome,
          type
          );
        });
        
      it(`it should serializes the out going message`, () => {

        return supertest(app)
          .get(`/api/transactions/${type}/${maliciousIncome.id}`)
          .set('Authorization', helper.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedIncome.name)
            expect(res.body.description).to.eql(expectedIncome.description)
          })
      });
    });

    context(`if there are xss attacks being installed for _expenses_ `, ()=>{
      
      const testUser = helper.makeUsersArray()[1]

      const {maliciousExpenses, expectedExpenses} = helper.makeMaliciousExpenses(testUser.id)

      const type = 'expenses';

      beforeEach('insert malicious transactions into tables', () =>{
       return helper.seedMaliciousTransaction(
          db,
          testUser,
          maliciousExpenses,
          type
          );
        });
        
      it(`it should serializes the out going message`, () => {

        return supertest(app)
          .get(`/api/transactions/${type}/${maliciousExpenses.id}`)
          .set('Authorization', helper.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedExpenses.name)
            expect(res.body.description).to.eql(expectedExpenses.description)
          })
      });
    });

    context('if a user lacks auth', ()=> {

      const transaction_id = 2;
      const type = 'income';

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      it('should give a 401',()=>{

        return supertest(app)
          .get(`/api/transactions/${type}/${transaction_id}`)
          .expect(401); 
      });

    });

    context('if a user tries to view a transaction that\'s not there own', ()=> {

      const transaction_id = 2;
      const type = 'income';

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      it('should give a 401',()=>{

        return supertest(app)
          .get(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[1]))
          .expect(401); 
      });

    });

    context('if trying to visit as transaction, that isn\'t there ', ()=> {

      const transaction_id = 99;
      const type = 'income';

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      it('should give a 400',()=>{

        return supertest(app)
          .get(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .expect(400); 
      });

    });
    
    
  });

  describe(`PATCH "/api/transaction/:type/:id" endpoint ` , () =>{

    context(`if given a valid auth token, and all conditions( valid, target_id, at less one field ) are met, FOR _income_`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });
      const transaction_id = 2; 
      const type = 'income';
      
      it(`it should update the new info into the DB and send back a 204`, () => {

        const updatedIncome = {
          name: 'Updated Income 2',
          description : 'updated',
          amount: 99000000.99,
          category : 'other',          
        };

        const filteredIncomeReply =  helper.makeTransactionReply( type ,testIncome[ transaction_id - 1 ]);

        const expectedUpdatedIncome = {
          ...filteredIncomeReply,
          ...updatedIncome
        }

        return supertest(app)
          .patch(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .send(updatedIncome)
          .expect(204)
          .then(() => 
            supertest(app)
            .get(`/api/transactions/${type}/${transaction_id}`)
            .set('Authorization', helper.makeAuthHeader(testUsers[0]))
            .expect(expectedUpdatedIncome)
          )
      });
    });

    context(`if given a valid auth token, and all conditions( valid, target_id, at less one field ) are met, FOR _expenses_`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      const transaction_id = 2; 
      const type = 'expenses';

      
      it(`it should update the new info into the DB and send back a 204`, () => {


        const updatedExpenses = {
          name: 'Updated Income 2',
          description : 'updated',
          amount: -51, /* (9999) throwing error if grater then .. */
          category : 'other',          
        };

        const filteredExpensesReply =  helper.makeTransactionReply( type ,testExpenses[ transaction_id - 1 ]);

        const expectedUpdatedExpenses = {
          ...filteredExpensesReply,
          ...updatedExpenses
        }

        return supertest(app)
          .patch(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .send(updatedExpenses)
          .expect(204)
          .then(() => 
            supertest(app)
            .get(`/api/transactions/${type}/${transaction_id}`)
            .set('Authorization', helper.makeAuthHeader(testUsers[0]))
            .expect(expectedUpdatedExpenses)
          )
      });
    });

    context(`if the user lacks Auth`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      const transaction_id = 2; 
      const type = 'expenses';

      
      it(`it should send back a 401`, () => {

        const updatedExpenses = {
          name: 'Updated Income 2',
          description : 'updated',
          amount: -51, /* (9999) throwing error if grater then .. */
          category : 'other',          
        };


        return supertest(app)
          .patch(`/api/transactions/${type}/${transaction_id}`)
          .send(updatedExpenses)
          .expect(401)
      });
    });

    context(`if the user is trying to update a transaction that's not there own`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      const transaction_id = 2; 
      const type = 'expenses';

      
      it(`it should update the new info into the DB and send back a 204`, () => {


        const updatedExpenses = {
          name: 'Updated Income 2',
          description : 'updated',
          amount: -51, /* (9999) throwing error if grater then .. */
          category : 'other',          
        };


        return supertest(app)
          .patch(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[1]))
          .send(updatedExpenses)
          .expect(401)
          });
    });

    context(`if there is no content being sent`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      const transaction_id = 2; 
      const type = 'expenses';

      
      it(`should send back 400`, () => {

        return supertest(app)
          .patch(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .expect(400)
      });
    });

    context(`if the user try to send an amount that is NaN`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
        );
      });

      const transaction_id = 2; 
      const type = 'expenses';

      
      it(`should send back 203, but only update that content that passes `, () => {

        const updatedExpenses = {
          name: 'Updated Income 2',
          description : 'updated',
          amount: 'oof',
          category : 'other',          
        };

        const filteredExpensesReply =  helper.makeTransactionReply( type ,testExpenses[ transaction_id - 1 ]);



        const expectedUpdatedExpenses = () => {
          delete updatedExpenses.amount 
          return {
            ...filteredExpensesReply,
            ...updatedExpenses
          }
        }
        

        return supertest(app)
          .patch(`/api/transactions/${type}/${transaction_id}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .send(updatedExpenses)
          .expect(204)
          .then(() => 
           supertest(app)
            .get(`/api/transactions/${type}/${transaction_id}`)
            .set('Authorization', helper.makeAuthHeader(testUsers[0]))
            .expect(200, expectedUpdatedExpenses())          
        )
          
      });
    });

  });

  describe(`DELETE "/api/transaction/:type/:id" endpoint ` , () =>{

    context(`if given a valid auth token, and the database has content`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const transactionIdToRemove = 2;
        const type = 'expenses';
        
      it(`it should insert the new info into the DB and send back a 204`, () => {

        const expectedIncomeArray = testIncome.filter(tr => tr.id !== transactionIdToRemove)
       
        return supertest(app)
          .delete(`/api/transactions/${type}/${transactionIdToRemove}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
    });

    context(`if user lacks Auth`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const transactionIdToRemove = 2;
        const type = 'expenses';
        
      it(`it should send back a 401`, () => {

        const expectedIncomeArray = testIncome.filter(tr => tr.id !== transactionIdToRemove)
       
        return supertest(app)
          .delete(`/api/transactions/${type}/${transactionIdToRemove}`)
          .expect(401);
      });
    });

    context(`if the user try to delete an transaction that's not there own`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const transactionIdToRemove = 2;
        const type = 'expenses';
        
      it(`should send back a 401`, () => {

        const expectedIncomeArray = testIncome.filter(tr => tr.id !== transactionIdToRemove)
       
        return supertest(app)
          .delete(`/api/transactions/${type}/${transactionIdToRemove}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[1]))
          .expect(401);
      });
    });

    context(`if user tries to delete a transaction that isn't there`, ()=>{

      beforeEach('insert transactions into tables', () =>{
        return helper.seedIncomeAndExpensesTables(
          db,
          testUsers,
          testIncome,
          testExpenses
          );
        });

        const transactionIdToRemove = 999;
        const type = 'expenses';
        
      it(`should send back a 400`, () => {
       
        return supertest(app)
          .delete(`/api/transactions/${type}/${transactionIdToRemove}`)
          .set('Authorization', helper.makeAuthHeader(testUsers[1]))
          .expect(400);
      });
    });
    
  });
  

});
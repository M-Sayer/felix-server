/* eslint-disable quotes */
const app = require('../src/app');
const helper = require('./testHelpers');


describe('Transaction Endpoint', ()=> {
  let db;

  before('make knex instance', () =>{
    db = helper.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helper.clearTables(db));

  afterEach('cleanup', () => helper.clearTables(db));

  describe(`GET "/api/transaction/singles" endpoint`, () => {
    
    
  } )


  




});
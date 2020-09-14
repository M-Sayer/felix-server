const app = require('../src/app');
const helper = require('./testHelpers');

describe('Transactions Endpoint', ()=> {
  let db;

  before('make knex instance', () =>{
    db = helper.makeKnexInstance();
    app.set('db', db);
  });
});
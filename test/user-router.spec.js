const app = require('../src/routes/user/user-router');
const helpers = require('./testHelpers');

describe('User router', () => {
  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.clearTables(db));

  afterEach('cleanup', () => helpers.clearTables(db));

  context('POST to /login', () => {
    before;
    it('POST to /login', () => {
      return supertest(app)
        .post('/login')
        .expect(200, { 'error': "Missing 'username' in request body" });
    });
  });
});
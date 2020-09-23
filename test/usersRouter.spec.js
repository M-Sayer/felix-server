const app = require('../src/app');

const {
  makeKnexInstance,
  makeAuthHeader,
  makeAllFixtures,
  seedUsersTable,
  seedGoalsTable,
  clearAllTables,
  convertTestGoal,
  convertTestGoals,
} = require('./testHelpers');

describe.only('Users Endpoints', () => {
  let db;

  const { testUsers } = makeAllFixtures();

  before('Connect to db', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('Disconnect from db', () => db.destroy());

  before('Clean up tables', () => clearAllTables(db));

  afterEach('Clean up tables', () => clearAllTables(db));

  describe('POST /login endpoint', () => {
		context('with valid user data', () => {
			it('should create a new user', () => {
				return supertest(app)
						.post(`/api/users/login/`)
						.set('Authorization', makeAuthHeader(testUsers[0]))
						.expect(200);
			});

		});
		context('with valid user data', () => {
			
		});
	});
 
});

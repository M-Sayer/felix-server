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
    db = makeKnexInstance();
    app.set('db', db);
  });

  after('Disconnect from db', () => db.destroy());

  before('Clean up tables', () => clearAllTables(db));

  afterEach('Clean up tables', () => clearAllTables(db));

  describe('POST /register endpoint', () => {
		context('with valid user data', () => {
			it('should create a new user', () => {
				const newUser = {
					first_name: 'Test First Name 1',
					last_name: 'Test Last Name 1',
					username: 'test-user-1',
					email: 'test-user-email-1@email.com',
					password: 'password',
				}
				return supertest(app)
						.post(`/api/users/register/`)
						.send({newUser})
						.expect(() =>
							db
								.from('users')
								.select('*')
								.where( 'email', 'test-user-email-1@email.com' )
								.first()
								.then((row) => {
									expect(row.username).to.eql('test-user-1');
								})
          );
			});
		});
		context('with invalid user data', () => {
			
		});
	});
 
});

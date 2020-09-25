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
						.post(`/api/users/register`)
						.set('Accept', 'application/json')
          	.set('Content-Type', 'application/json')
						.send({newUser})
						.expect(201)
						.expect( () =>
							supertest(app)
							.get(`/api/users`)
							.set('Authorization', helper.makeAuthHeader(testUsers[0]))
							.expect(200, newUser)
						)
			});
		});
		context('with invalid user data', () => {
			const requiredFields = ['first_name', 'last_name', 'username', 'email', 'password'];

			requiredFields.forEach((field) => {
				const registerAttemptBody = {
					first_name: 'Test First Name 1',
					last_name: 'Test Last Name 1',
					username: 'test-user-1',
					email: 'test-user-email-1@email.com',
					password: 'password',
				}

			it(`responds with 400 required error when '${field}' is missing`, () => {
				delete registerAttemptBody[field];

				return supertest(app)
					.post('/api/users/register')
					.send(registerAttemptBody)
					.expect(400, {
						error: `Missing ${field} in request body`,
					});
			});
		});
	});
	})
	describe.skip('POST /login endpoint', () => {
		context('given valid login data', () => {
			it('should return a 200 and redirect to dashboard')
		})
		context('given invalid login data', () => {
			it('should return 401 unauthorized')
		})
	})
});

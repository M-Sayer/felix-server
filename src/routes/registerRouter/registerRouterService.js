/* eslint-disable no-console */
const registerRouterServices = {
  getUsers(req, res) {
    console.log('user got')
    return {
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    }
  },
  createUser(req, res) {
    console.log('user created')
    //do some knex stuff with db
  },
  getUser(req, res) {
    console.log('user created')
    //do some knex stuff with db
  },
  updateUser(req, res) {
    console.log('user created')
    //do some knex stuff with db
  },
  deleteUser(req, res) {
    console.log('user created')
    //do some knex stuff with db
  },
}

export default registerRouterServices

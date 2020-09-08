/* eslint-disable no-console */
const userRouterService = {
  getUsers(req, res) {
    console.log('user got')
    //do some knex stuff with db
  },
  createUser(req, res) {
    console.log('createUser ran')
    //do some knex stuff with db
  },
  getUser(req, res) {
    console.log('getUser ran')
    return {
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    }
    //do some knex stuff with db
  },
  updateUser(req, res) {
    console.log('updateUser ran')
    //do some knex stuff with db
  },
  deleteUser(req, res) {
    console.log('deleteUser ran')
    //do some knex stuff with db
  },
}
module.exports = userRouterService

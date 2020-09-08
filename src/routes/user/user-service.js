/* eslint-disable no-console */
const userService = {
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then((user) => !!user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  getUsers(req, res) {
    console.log('user got')
    //do some knex stuff with db
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user)
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    }
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
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
module.exports = userService

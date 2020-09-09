/* eslint-disable no-console */
const bcrypt = require('bcrypt')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const userService = {
  hasUserWithUserName(/*db,*/ username) {
    return false //returning false is for testing only, this tells user-router that username is available
    // return db('user')
    //   .where({ username })
    //   .first()
    //   .then((user) => !!user)
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },

  insertUser(/*db,*/ newUser) {
    console.log(`insertUser ran`)
    return newUser
    // return db
    //   .insert(newUser)
    //   .into('user')
    //   .returning('*')
    //   .then(([user]) => user)
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },

  getUser(req, res) {
    console.log('getUser ran')
    return true //returns true for testing purposes, set to false to emulate no user found or wrong password
    // return db('user')
    //   .where({ username, password })
    //   .first()
  },
}
module.exports = userService

const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



/**
 * make a knex instance for postgres
 * @returns { db }
 */
const makeKnexInstance = () =>{
  return knex({
    client : 'pg',
    connection: process.env.DATABASE_URL,
  });
};


module.exports = {
  makeKnexInstance,
};
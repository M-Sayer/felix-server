const xss = require('xss');

const TransactionsService = {
  getUserDetails(db, id) {
    return db('users')
      .select('*')
      .where({ id })
      .first();
  },

  getUserIncome(db, user_id) {
    return db('income')
      .select('*')
      .where({ user_id });
  },
  /**
   * @param {knex} db
   * @param {number} user_id
   * @returns {array}
   **/

  getUserExpenses(db, user_id) {
    return db('expenses')
      .select('*')
      .where({ user_id });
  },

  getSingleTransaction(db, type, id) {
    return db.select()
      .from(type)
      .where({ id })
      .first();
  },
  patchSingleTransaction(db,type,id,content){
    
  },
};

module.exports = TransactionsService;

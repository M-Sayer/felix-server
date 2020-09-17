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

  //type is a string of either 'income' or 'expenses'
  createTransaction(db, type, newTransaction) {
    return db
      .insert(newTransaction)
      .into(type)
      .catch((error) => error);
  },

  patchSingleTransaction(db,type,id,content) {
    return db(type)
      .where({id})
      .update(content);
  },
  deleteTransaction(db,type,id){
    return db(type)
      .where({id})
      .delete();
  }
};

module.exports = TransactionsService;

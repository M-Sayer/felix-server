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
<<<<<<< HEAD
  patchSingleTransaction(db, type, id, content){
=======

  patchSingleTransaction(db,type,id,content) {
>>>>>>> edd4b7d188d64f6e69ef933a88bb30f317f8b519
    return db(type)
      .where({id})
      .update(content);
  },
  deleteTransaction(db, type, id){
    return db(type)
      .where({id})
      .delete();
  }
};

module.exports = TransactionsService;

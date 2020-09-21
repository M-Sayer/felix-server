const xss = require('xss');
const { updateAllowance, updateBalance, getDifference, selectTransactionAmount } = require('../../helpers');

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

  getTransaction(db, type, id) {
    return db.select()
      .from(type)
      .where({ id })
      .first();
  },

  //type is a string of either 'income' or 'expenses'
  async createTransaction(db, type, newTransaction) {
    await db.transaction(async trx => {
      await trx(type)
        .insert(newTransaction)
        .catch(error => error);

      const t = newTransaction; 
      await updateAllowance(db, t.user_id, t.income_amount || t.expense_amount);
      await updateBalance(db, t.user_id, t.income_amount || t.expense_amount);
    });
  },
  
  async patchSingleTransaction(db, type, id, userId, content) {
    // get transaction amount before patch
    const oldAmt = await selectTransactionAmount(db, type, id);
    //add the difference between the amounts to balance/allowance
    const difference = getDifference(oldAmt, content.income_amount || content.expense_amount);
    
    await db.transaction(async trx => {
      await trx(type).where({ id }).update(content);
      await updateAllowance(db, userId, difference);
      await updateBalance(db, userId, difference);
    });

  },
  async deleteTransaction(db, type, id, userId){
    // get transaction amount before delete
    const amount = await selectTransactionAmount(db, type, id);
    // add the negative of that amount to balance/allowance
    const difference = amount * -1

    await db.transaction(async trx => {
      await trx(type).where({ id }).delete();
      await updateAllowance(db, userId, difference);
      await updateBalance(db, userId, difference);
    })
  },
};

module.exports = TransactionsService;

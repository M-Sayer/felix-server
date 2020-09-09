const UsersRouterService = {
  
  getUserDetails(db, id) {
    return db('users')
      .select('*')
      .where({id})
  },

  getUserIncome(db, user_id) {
    return db('income')
      .select('*')
      .where({user_id})
  },

  getUserExpense(db, user_id) {
    return db('expenses')
      .select('*')
      .where({user_id})
  },
};

module.exports = UsersRouterService;
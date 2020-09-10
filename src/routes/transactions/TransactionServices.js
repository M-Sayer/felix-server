const xss = require('xss');



const TransactionServices ={
  getSingleTransaction(db, type, id){
    return db
      .select()
      .from(type)
      .where({id})
      .first();
  },
};
    

module.exports = TransactionServices; 
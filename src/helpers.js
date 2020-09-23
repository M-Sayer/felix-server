const { selectUserAllowance } = require('../automationHelpers');

const selectUserBalance = async id => {
  const result = await db('users')
    .select('balance')
    .where({ id })
    .first();
  
  return result.balance;
};

const selectTransactionAmount = async (db, type, id) => {
  let name = type;
  if (type === 'expenses') {name = 'expense';}
  const result = await db(type).where({ id })
    .select(`${name}_amount`).first();
  return result[`${name}_amount`];
};

const convertToCents = (dollars) => {
  return dollars * 100;
};

const convertToDollars = (cents) => {
  return cents / 100;
};

const convertTransactionsToDollars = (arr, type) => {
  return arr.map(obj => {
    const dollarAmount = convertToDollars(obj[`${type}_amount`]);
    obj[`${type}_amount`] = dollarAmount;
    return obj;
  });
};

const getDifference = (oldAmt, newAmt) => {
  return (oldAmt - newAmt) * -1;
};

const updateAllowance = async (db, id, amount) => {
  const allowance = await selectUserAllowance(id);
  //if subtracting amount from allowance will leave negative allowance
  //subtract allowance from itself to leave allowance at 0
  if (allowance + amount < 0) { amount = allowance * -1;}

  await db('users')
    .where({ id })
    .update({ allowance: db.raw(`?? + ${amount}`, ['allowance'])});
};


const updateBalance = async (db, id, amount) => {

  await db('users')
    .where({ id })
    .update({ balance: db.raw(`?? + ${amount}`, ['balance'])});
};

module.exports = {
  selectTransactionAmount,
  convertToCents,
  convertToDollars,
  convertTransactionsToDollars,
  getDifference,
  updateAllowance,
  updateBalance,
};


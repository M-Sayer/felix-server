const { selectUserAllowance } = require("../automationHelpers");

const selectUserBalance = async id => {
  const result = await db('users')
    .select('balance')
    .where({ id })
    .first();
  
  return result.balance;
};

const selectTransactionAmount = async (db, type, id) => {
  let name = type;
  if (type === 'expenses') name = 'expense';
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

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

/**
 * Allocates funds based on ratios provided
 * Returns array of allocation amounts for each ratio
 * @param {Array} ratios 
 * @param {Number} amount
 * @returns {Array}
 */
const allocate = (ratios, amount) => {
  let remainder = amount;
  let results = [];
  let total = 0;

  //total shares equals sum of ratios
  ratios.forEach(ratio => total += ratio);

  //each share equals ratio/total from amount
  ratios.forEach(ratio => {
    const share = Math.floor(amount * ratio/total);
    results.push(share);
    remainder -= share;
  });

  //add one from remainder to each share until no remainder
  for (let i = 0; remainder > 0; i++) {
    results[i] = results[i] + 1;
    remainder --;
  };

  return results;
};

const updateTotalSaved = async (db, id, amount) => {
  await db('users').where({ id })
    .update({ total_saved: db.raw(`?? + ${amount}`, ['total_saved'])});
};

/**
 *  Gets total number of user goals
 *  determines deallocation amount for each goal based on amount provided
 *  subtracts deallocation amount from each goal
 * @param {Number} user_id - userId 
 * @param {Number} amount - total amount to deallocate from user's goals 
 */

const deallocateGoals = async (trx, user_id, amount) => {
  try { 
    const result = await trx('goals').select().where({ user_id });
    const goals = result.filter(goal => goal.current_amount > 0)
    console.log(goals);
    let ratios = [];
    goals.forEach(() => ratios.push(1));
    console.log('ratios: ', ratios);
    console.log(amount);
    const deallocateAmt = allocate(ratios, amount);
    console.log('deallocate amt: ', deallocateAmt);
  
    for (let i = 0; i < goals.length; i++) {
      console.log(goals[i].id)
      const goal = goals[i];
      await trx('goals').where({ id: goal.id })
        .update({ current_amount: trx.raw(`?? - ${deallocateAmt[i]}`, ['current_amount'])}); 

      await updateTotalSaved(trx, goal.user_id, deallocateAmt[i] * -1);
    };

  } catch (error) {
    console.log(error)
  }
};

const selectTotalSaved = async (db, id) => {
  const res = await db('users').where({ id }).select('total_saved').first();
  return res.total_saved;
}


const updateAllowance = async (trx, id, amount) => {
  try {
    const allowance = await selectUserAllowance(id);
      const difference = allowance + amount;
      console.log('allowance: ', allowance)
      console.log('amount: ', amount)
      console.log('diff: ', allowance + amount)
      
      const totalSaved = await selectTotalSaved(trx, id);
      console.log(totalSaved)
      let deallocateAmt
      // if adding expense (-)amount to allowance will leave negative allowance:
      // subtract allowance from itself to leave allowance at 0
      // deallocate allowance + (-)amount from goals 
      if (difference < 0) {
        amount = allowance * -1;
        (totalSaved + difference <= 0) 
          ? deallocateAmt = totalSaved
          : deallocateAmt -= difference;
        console.log('d amt: ', deallocateAmt); 
        await deallocateGoals(trx, id, deallocateAmt);
      } else amount -= totalSaved;

      //update amount = goals
      await trx('users')
        .where({ id })
        .update({ allowance: trx.raw(`?? + ${amount}`, ['allowance'])});
  } catch (error) {
    console.log(error);
  }
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
  updateTotalSaved,
};


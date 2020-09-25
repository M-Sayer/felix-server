const { updateTotalSaved, updateAllowance } = require('./src/helpers');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const selectGoals = async (db, params) => {
  return await db('goals')
    .select(
      'goals.id',
      'goals.name',
      'user_id',
      'goal_amount',
      'contribution_amount',
      'current_amount',
      'end_date',
      'completed',
      'users.allowance',
      'users.balance',
    )
    .where(params)
    .join('users', {'goals.user_id': 'users.id'});
};

const updateGoal = async (db, id, params) => {
  await db('goals')
    .where({ id })
    .update(params);
};

const createAlert = async (db, user_id, complete, name) => {
  return await db('alerts')
    .insert({
      'user_id': user_id,
      'title': complete ? 'Goal Complete!' : 'Insufficient Allowance.',
      'message': complete ? `You completed your goal, ${name}` : `Looks like you don't have enough allowance to fund your goal, ${name}`,
    });
};

/**
 * Subtracts contribution amount from allowance, and adds to goal
 * Updates goal, allowance, and total saved
 * 
 * @param db - Knex
 * @param {Object} goal - goal object from goals table 
 * @param {Boolean} adjusted - adjusts value of contribution amount if true
 */
const moveContribution = async (db, goal, adjusted) => {
  // calculate the difference if the contibution amt needs to be adjusted
  const difference = goal.goal_amount - goal.current_amount;
  let amount = goal.contribution_amount;

  let deduction;
  adjusted
    ? deduction = difference * -1 // if true, deduct difference from allowance 
    : deduction = goal.contribution_amount * -1;  //if false, deduct contribution amt from allowance

  // add contribution amount to goal's current amount
  adjusted
    ? goal.current_amount += difference //if true, add difference to current amt
    : goal.current_amount += goal.contribution_amount; // if false, add contribution amt to current amt

  if (adjusted) amount = difference;

  await db.transaction(async trx => {
    // update allowance value on users table
    await updateTotalSaved(trx, goal.user_id, amount);
    await updateAllowance(trx, goal.user_id, deduction)
    // update current amount in goals table
    await updateGoal(trx, goal.id, { 'current_amount': goal.current_amount });
  });
};

/**
 * Sets user goal as completed 
 * 
 * @param {Object} goal - goal object from goals table 
 * @param {Number} allowance - allowance from users table
 * @param {Boolean} adjusted - adjusts value of contribution amount if true
 */
const completeGoal = async (db, goal, adjusted) => {
  await db.transaction(async trx => {
    await moveContribution(db, goal, adjusted);
    await updateGoal(db, goal.id, { 'completed': true });
    await createAlert(db, goal.user_id, complete = true, goal.name);
  });
};

module.exports = {
  asyncForEach,
  selectGoals,
  updateGoal,
  createAlert,
  moveContribution,
  completeGoal,
};
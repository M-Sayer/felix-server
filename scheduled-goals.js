// this script will be automated by Heroku Scheduler
// it will run every every sunday at 00:01 UTC
// for dev, we'll run it every 2 minutes


// this script needs to query the goals table
// select all goals that are not complete
// join the users table on uid and select balance and allowance
// for each goal -> 
//  if allowance > contribution amt. -> 
//    get allowance
//    if goal amt. - current amt. > contribution amt. ->      
//      subtract contribution amt. from allowance && add to current amt.
//      update db
//      continue with next goal
//    if goal amt. - current amt. = contribution amt. ->
//      subtract contribution amt. from allowance && add to current amt.
//      set "completed" to true
//      alert user: goal successful
//      update db
//      continue with next goal
//    if goal amt. - current amt. < contribution amt. ->
//      subtract (goal amt. - current amt.) from allowance && add to current amt.
//      set "completed" column true
//      alert user: goal successful
//      update db
//      continue with next goal
//    
//  if allowance < contribution amt. -> 
//    alert user: not enough allowance to fund goal
//    update db
//    continue with next goal


//check end date

const knex = require("knex");

const { DATABASE_URL } = require('./src/config');

//  pg returns numeric values as strings
//  this converts all numeric types to floats (decimal)
var types = require('pg').types
types.setTypeParser(1700, function(val) {
  return parseFloat(val)
})

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

async function automateGoals () {
  try {
    const selectGoals = async params => {
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
    }

    const selectAllowance = async id => {
      const result =  await db('users')
        .select('allowance')
        .where({ id })
        .first()

        return result.allowance
    }

    const selectGoal = async id => {
      return await db('goals')
        .select()
        .where({ id })
        .first()
    }

    const updateGoal = async (id, params) => {
      return await db('goals')
        .where({ id })
        .update(params)
    }

    const createAlert = async (userId, complete, name) => {
      return await db('alerts')
        .insert({
          'user_id': userId,
          'title': complete ? 'Goal Complete!' : 'Insufficient Allowance.',
          'message': complete ? `You completed your goal, ${name}` : `Looks like you don't have enough allowance to fund your goal, ${name}`,
        })
    }

    const selectUserAlerts = async (user_id) => {
      const alerts = await db('alerts')
        .select()
        .where({ user_id })
      
        console.log(alerts)
    }

    const moveContribution = async (goal, allowance, adjusted) => {
      
      const difference = goal.goal_amount - goal.contribution_amount;
      
      // subtract contribution amount from allowance
      adjusted
        ? allowance -= difference // if true, subtract difference from allowance 
        : allowance -= goal.contribution_amount  //if false, subtract contribution amount from allowance

      // update allowance value on users table
      await db('users')
        .where({ 'id': goal.user_id})
        .update({ allowance: allowance })

      // add contribution amount to goal's current amount
      adjusted
        ? goal.current_amount += difference //if true, add difference to current amt
        : goal.current_amount += goal.contribution_amount // if false, add contribution amt to current amt
      
      // update current amount in goals table
      await updateGoal(goal.user_id, { 'current_amount': goal.current_amount })
      
      const g = await selectGoal(goal.id) //dev
      console.log(g.name, g.current_amount, g.completed)
    }

    const goals = await selectGoals({ 'completed': 'false' })

      // const markComplete = async goal => {
      //   return await trx('goals').where({ id: goal.id }).update({ completed: true });
      // }

      // insert while in loop
      // recheck balance and allowance in loop
      goals.forEach(async goal => {
        const allowance = await selectAllowance(goal.user_id)
        if (allowance > goal.contribution_amount) {
          if (goal.goal_amount - goal.current_amount > goal.contribution_amount) {
            return moveContribution(goal, allowance, adjusted = false);
          }
          if (goal.goal_amount - goal.current_amount === goal.contribution_amount) {
            moveContribution(goal, allowance, adjusted = false);
            await updateGoal(goal.id, { 'completed': true}); //update goal to completed
            await createAlert(goal.user_id, complete = true, goal.name);
            await selectUserAlerts(goal.user_id); // dev
            return;
          }
          if (goal.goal_amount - goal.current_amount < goal.contribution_amount) {
            // allowance - (goal amt - contr amt)
            moveContribution(goal, allowance, adjusted = true);
            await updateGoal(goal.id, { 'completed': true});
            await createAlert(goal.user_id, complete = true, goal.name);
            await selectUserAlerts(goal.user_id); // dev
            return;
          }
        }  
        if (allowance < goal.contribution_amount) {
          await createAlert(goal.user_id, complete = false, goal.name);
          await selectUserAlerts(goal.user_id); // dev
          return;
        }

      });
    

    // const trxResult = await db.transaction(async trx => {
    // });
    
      

      
    
  } catch (error) {
    console.log(error);
  }
};

module.exports = automateGoals;